import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const user = await User.create({ name, email, password });
    return NextResponse.json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
