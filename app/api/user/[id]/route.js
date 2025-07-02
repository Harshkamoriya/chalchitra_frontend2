 
 import { connectToDB } from "@/lib/db";
 import User from "@/models/user";
 import { NextResponse } from "next/server";
 
 export async function GET(req, { params }) {
 
  await connectToDB();
  try {
    const { id } = params;
    console.log(id, "id from params");
    const dbUser = await User.findOne({ _id: id });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: "User not found", status: 404 });
    }

    console.log("User found successfully", dbUser);

    return NextResponse.json({
      success: true,
      status: 200,
      message: "User found successfully",
      user: dbUser
    });
  } catch (error) {
    console.error("GET /api/user/[id] error:", error.message);
    return NextResponse.json({ success: false, message: "Server error", error });
  }

}