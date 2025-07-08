import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";  // ✅ make sure you import bcrypt

export async function POST(req) {
  console.log("📌 [Signup] Called POST /api/auth/signup");

  await connectToDB();

  try {
    const { name, email, password, role } = await req.json();

    console.log("🟢 Received data:", { name, email, password, role });

    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const lowerCaseEmail = email.toLowerCase();
    console.log("✉️ Normalized email:", lowerCaseEmail);

    const userExists = await User.findOne({ email: lowerCaseEmail });
    console.log("🔍 Existing user:", userExists);

    if (userExists) {
      console.log("❌ User already exists");
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 Hashed password:", hashedPassword);

    const newUser = new User({
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
      role: role || "buyer",
      phoneNumber:'+919234**7890'
    });

    const savedUser = await newUser.save();
    console.log("✅ New user saved:", savedUser);

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 [Signup Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
