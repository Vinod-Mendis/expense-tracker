import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB = "expense-tracker";
const COLLECTION = "income";

export async function GET() {
  try {
    const client = await clientPromise;
    const income = await client
      .db(DB)
      .collection(COLLECTION)
      .find()
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json(income);
  } catch {
    return NextResponse.json({ error: "Failed to fetch income" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, amount, date, notes, receiptUrl, receiptName } = body;

    if (!title || !category || !amount || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const doc = {
      title,
      category,
      amount: parseFloat(amount),
      date,
      notes: notes || undefined,
      receiptUrl: receiptUrl || undefined,
      receiptName: receiptName || undefined,
      createdAt: new Date(),
    };

    const result = await client.db(DB).collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create income" }, { status: 500 });
  }
}
