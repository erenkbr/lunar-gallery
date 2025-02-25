// app/api/catalog/route.js
import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';
import { getObjektModel } from '@/app/models/Objekt';

const ARTMS_MEMBERS = ["HeeJin", "HaSeul", "KimLip", "JinSoul", "Choerry"];
const TRIPLES_MEMBERS = [
  "SeoYeon", "HyeRin", "JiWoo", "ChaeYeon", "YooYeon", "SooMin", "NaKyoung", "YuBin",
  "Kaede", "DaHyun", "Kotone", "YeonJi", "Nien", "SoHyun", "Xinyu", "Mayu", "Lynn",
  "JooBin", "HaYeon", "ShiOn", "ChaeWon", "Sullin", "SeoAh", "JiYeon"
];
const TRIPLES_MEMBER_CODES = {
  "SeoYeon": "S1", "HyeRin": "S2", "JiWoo": "S3", "ChaeYeon": "S4", "YooYeon": "S5",
  "SooMin": "S6", "NaKyoung": "S7", "YuBin": "S8", "Kaede": "S9", "DaHyun": "S10",
  "Kotone": "S11", "YeonJi": "S12", "Nien": "S13", "SoHyun": "S14", "Xinyu": "S15",
  "Mayu": "S16", "Lynn": "S17", "JooBin": "S18", "HaYeon": "S19", "ShiOn": "S20",
  "ChaeWon": "S21", "Sullin": "S22", "SeoAh": "S23", "JiYeon": "S24"
};

const memberSchema = z.string().regex(/^[a-zA-Z]+$/, "Member must be alphanumeric").optional().nullable().transform((val) => val || undefined);
const groupSchema = z.string().optional().nullable().transform((val) => val || "ARTMS").refine((val) => ["ARTMS", "tripleS"].includes(val), { message: "Only ARTMS or tripleS supported" });

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberResult = memberSchema.safeParse(searchParams.get("member"));
    const groupResult = groupSchema.safeParse(searchParams.get("group"));

    if (!memberResult.success) return NextResponse.json({ error: "Invalid member", details: memberResult.error.message }, { status: 400 });
    if (!groupResult.success) return NextResponse.json({ error: "Invalid group", details: groupResult.error.message }, { status: 400 });

    const member = memberResult.data;
    const group = groupResult.data;

    console.log(`Requested group: ${group}, member: ${member || 'all'}`);

    await dbConnect();

    const collectionName = group === "ARTMS" ? "artms-objekts" : "triples-objekts";
    console.log(`Selected collection: ${collectionName}`);
    const ObjektModel = getObjektModel(collectionName);

    let filter = {};
    if (member) {
      if ((group === "ARTMS" && !ARTMS_MEMBERS.includes(member)) || 
          (group === "tripleS" && !TRIPLES_MEMBERS.includes(member))) {
        return NextResponse.json({ error: `Member ${member} not found in ${group}` }, { status: 400 });
      }
      filter = { member: group === "tripleS" ? TRIPLES_MEMBER_CODES[member] : member };
    } else {
      const members = group === "ARTMS" ? ARTMS_MEMBERS : Object.values(TRIPLES_MEMBER_CODES);
      filter = { member: { $in: members } };
    }

    console.log(`Querying ${collectionName} with filter:`, filter);

    const objekts = await ObjektModel.find(filter).sort({ season: 1, collection: 1, member: 1 }).lean();
    console.log(`Found ${objekts.length} objekts`);

    return NextResponse.json({ objekts });
  } catch (error) {
    console.error("Catalog API error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}