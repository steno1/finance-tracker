import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/models/Transactions";
import jwt from "jsonwebtoken";

connectDB();

// ✅ Helper to get userId from token
const getUserFromToken = (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    return decoded?.id || null;
  } catch (err) {
    return null;
  }
};

// ✅ GET — Get transactions belonging to logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserFromToken(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// ✅ POST — Create a transaction with attached userId
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserFromToken(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, amount, type } = body;

    const newTransaction = await Transaction.create({
      title,
      amount,
      type,
      userId,
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete only users own transaction
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserFromToken(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );

    const deleted = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!deleted)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Transaction deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete" },
      { status: 500 }
    );
  }
}

// ✅ PUT — Update only logged-in user transactions
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserFromToken(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );

    const body = await req.json();
    const { title, amount, type } = body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { title, amount, type },
      { new: true }
    );

    if (!updated)
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
