import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
  await connectToDB();

  try {
    const { name, email, password, role } = await req.json();
    const userExists = await User.findOne({ email });
    if (userExists) return NextResponse.json(
     { error:"user already exist"},{status:400}
    );
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name , email , password:hashedPassword, role
  })
  await newUser.save();
  return NextResponse.json({success:true , status:200 , message:"user created successfully"})

  } catch (error) {

    console.error("internal server error" ,error.message)
    return NextResponse.json({message:"internal server error ", status:500  , error})
  }
}

// // app/api/signup/route.js

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import User from "@/models/user";
// import { connectToDB } from "@/lib/db";

// export async function POST(req) {
//   try {
//     await connectToDB();

//     const { name, email, password } = await req.json();

//     // ✅ Basic validation
//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     // ✅ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: "User already exists" }, { status: 409 });
//     }

//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Create and save user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       provider: "credentials",
//       role: "user", // Optional, default in schema
//     });

//     await newUser.save();

//     return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
