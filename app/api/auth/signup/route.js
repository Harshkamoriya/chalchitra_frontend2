import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectToDB();  // Connect to MongoDB
    const { name, email, password, phone, role } = await req.json();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists!" }, { status: 400 });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      provider: "credentials", // User signed up manually
    });

    await newUser.save(); // Save user to DB

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
