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
    console.log("in the backend route of professional data")
    const body = await req.json();
    console.log(body , "body fetched in the backend")
    // console.log(body);
    console.log(session , "session")

    const {
      occupation,
    skills,
    education,
    certifications,
    website,

    } = body;

    // const name = firstName + " "+ lastName;

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
                occupation,
    skills,
    education,
    certifications,
    website,
         
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error , "error in catch");
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

