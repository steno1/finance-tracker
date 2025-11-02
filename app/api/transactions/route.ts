import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/models/Transactions";

// Connect to MongoDB
connectDB();

export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find().sort({ createdAt: -1 });

    return NextResponse.json(transactions);   
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, amount, type } = body;

    const newTransaction = await Transaction.create({ title, amount, type });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const deleted = await Transaction.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });

  } catch (error: any) {
    console.log("DELETE ERROR:", error);   
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { title, amount, type } = body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { title, amount, type },
      { new: true } 
    );

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
