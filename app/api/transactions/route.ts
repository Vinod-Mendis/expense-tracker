import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB = "expense-tracker";
const COLLECTION = "transactions";

export async function GET() {
  try {
    const client = await clientPromise;
    const transactions = await client
      .db(DB)
      .collection(COLLECTION)
      .find()
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, amount, type, category, date, notes } = body;

    if (!title || !amount || !type || !category || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const doc = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes: notes || undefined,
      createdAt: new Date(),
    };

    const result = await client.db(DB).collection(COLLECTION).insertOne(doc);
    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
