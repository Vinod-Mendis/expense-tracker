import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB = "expense-tracker";
const COLLECTION = "wishlist";

export async function GET() {
  try {
    const client = await clientPromise;
    const docs = await client
      .db(DB)
      .collection(COLLECTION)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(docs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, totalPrice } = body;

    if (!name || !category || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const doc = {
      name,
      category,
      description: body.description || undefined,
      totalPrice: parseFloat(totalPrice),
      advancePaid: parseFloat(body.advancePaid) || 0,
      progress: parseFloat(body.progress) || 0,
      monthlySaving: parseFloat(body.monthlySaving) || 0,
      priority: body.priority || "medium",
      deadline: body.deadline || undefined,
      status: body.status || "not_started",
      image: body.image || undefined,
      link: body.link || undefined,
      createdAt: new Date(),
    };

    const result = await client.db(DB).collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create wishlist item" }, { status: 500 });
  }
}
