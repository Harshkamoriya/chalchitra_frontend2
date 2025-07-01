import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { authenticateUser } from "@/middlewares/auth";

export async function POST(req) {
  await connectToDB();

 const authResult  = authenticateUser(req);

 if(authResult instanceof Response) return authResult;

 

  try {
    const { newRole } = await req.json();

    const {id ,role} = req.user()
    console.log("id ", id);

    const user = await User.findOne({id});
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    user.role = newRole;
    await user.save();

    return NextResponse.json({
      success: true,
      status: 200,
      message: "Role updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("POST /api/user/switch-role error:", error.message);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
