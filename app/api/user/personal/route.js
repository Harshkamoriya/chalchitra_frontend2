// app/api/user/personal/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDB();

  try {
    const body = await req.json();
    console.log(body);
    console.log(session , "session")

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
      { email: session.user.email },
      {
        $set: {
          name:`${firstName}${lastName}`,
          displayName,
          profileImage,
          description,
          languages,
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
