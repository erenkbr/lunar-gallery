// app/api/filters/route.js
import { NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/app/lib/dbconnect';
import { getObjektModel } from '@/app/models/Objekt';

const groupSchema = z.string().optional().nullable().transform((val) => val || "ARTMS").refine((val) => ["ARTMS", "tripleS"].includes(val), { message: "Only ARTMS or tripleS supported" });

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupResult = groupSchema.safeParse(searchParams.get("group"));

    if (!groupResult.success) return NextResponse.json({ error: "Invalid group", details: groupResult.error.message }, { status: 400 });

    const group = groupResult.data;

    await dbConnect();

    const collectionName = group === "ARTMS" ? "artms-objekts" : "triples-objekts";
    const ObjektModel = getObjektModel(collectionName);

    // Fetch unique values using aggregation for deeply nested field
    const seasons = await ObjektModel.distinct("season");
    const collections = await ObjektModel.distinct("collection");
    const classesAggregation = await ObjektModel.aggregate([
      // Unwind the metadata Map if necessary (optional, depending on structure)
      { $match: { "metadata.metadata.objekt.class": { $exists: true } } }, // Ensure the field exists
      { $group: { _id: "$metadata.metadata.objekt.class" } }, // Group by the nested class field
      { $sort: { _id: 1 } }, // Sort alphabetically
      { $project: { _id: 0, value: "$_id" } } // Rename _id to value
    ]);

    // Extract class values from aggregation result
    const classes = classesAggregation.map(doc => doc.value).filter(val => val != null);

    console.log(`Fetched filters for ${collectionName}:`, { seasons, collections, classes });

    return NextResponse.json({
      seasons: seasons.sort(),
      collections: collections.sort(),
      classes: classes.sort(),
    });
  } catch (error) {
    console.error("Filters API error:", error);
    return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
  }
}