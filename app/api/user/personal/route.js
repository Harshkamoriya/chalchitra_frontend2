// app/api/user/personal/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";
import { verifyAccessToken } from "@/lib/jwt";


export async function POST(req) {


  await connectToDB();

  try {
    const body = await req.json();
    console.log(body);

    const {
      firstName,
      lastName,
      displayName,
      profileImage,
      description,
      languages,

    } = body;

    // const name = firstName + " "+ lastName;

    const updatedUser = await User.findOneAndUpdate(
      {id},
      {
        $set: {
          name:`${firstName}${lastName}`,
          displayName,
          profileImage,
          description,
          languages,
          isSeller:true,
          role:"seller"
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
