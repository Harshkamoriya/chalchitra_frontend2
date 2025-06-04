import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import authOptions from "@/lib/authOptions";

export async function GET(req) {
  await connectToDB();
  console.log("authOptions in fetch user route", authOptions);
  const session = await getServerSession(authOptions); // ✅ FIXED LINE

  console.log("session in fetch user route", session);

  if (!session || !session.user?.email) {
    console.log("Session invalid or email missing", session);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log("User not found in DB for:", session.user.email);
      return NextResponse.json({
        success: false,
        message: "User not found in DB",
        status: 404,
      });
    }

    return NextResponse.json({
      success: true,
      message: "user data found successfully",
      status: 200,
      user,
    });
  } catch (error) {
    console.error("error fetching the user data", error.message);
    return NextResponse.json({
      success: false,
      message: error.message,
      status: 500,
    });
  }
}
