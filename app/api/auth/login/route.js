import { connectToDB } from "@/lib/db";
import User from "@/models/user";

import { bcrypt } from "bcryptjs";
import { generateTokens } from "@/lib/jwt";

export async function POST(req) {
  await connectToDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !user.password) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return Response.json({ error: "Invalid credentials" }, { status: 401 });

  const { accessToken, refreshToken } = generateTokens(user);

  return new Response(JSON.stringify({ accessToken }), {
    status: 200,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
      "Content-Type": "application/json"
    }
  });
}