import { connectToDB } from "@/lib/db";
import bcrypt from "bcrypt"; 
import User from "@/models/user";
import { generateTokens } from "@/lib/jwt";


export async function POST(req) {
  console.log("inside login function");
  await connectToDB();

  const { email, password } = await req.json();

  console.log(email ,"email")
  console.log(password , "password");

  const user = await User.findOne({ email :email});


  console.log(user , "user")
  console.log(user?.password , "user password")

  if (!user || !user.password) {
    console.log("No user or password missing");
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    console.log("Password mismatch");
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { accessToken, refreshToken } = generateTokens(user);
  console.log("Login successful!");

  return new Response(JSON.stringify({ accessToken }), {
    status: 200,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
      "Content-Type": "application/json"
    }
  });
}
