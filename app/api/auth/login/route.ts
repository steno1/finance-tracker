import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "../../../../models/user";

import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    // Lookup user
    const user = await User.findOne({ email });
    console.log("Login attempt for email:", email);
    console.log("User found for login:", user);

    if (!user)
      return NextResponse.json({ error: "Invalid credentials (email not found)" }, { status: 401 });

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);

    if (!isMatch)
      return NextResponse.json({ error: "Invalid credentials (wrong password)" }, { status: 401 });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
