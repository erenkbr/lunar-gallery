// app/api/catalog/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbconnect';
import Objekt from '@/app/models/Objekt';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const member = searchParams.get("member");
    
    await dbConnect();

    // If a member is provided, filter by that member; otherwise, return all objekts
    const filter = member ? { member } : {};

    // Fetch all matching Objekt documents, sorted by createdAt (newest first)
    const objekts = await Objekt.find(filter).sort({ season: 1, collection: 1, member: 1 }).lean();

    return NextResponse.json({ objekts });
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
