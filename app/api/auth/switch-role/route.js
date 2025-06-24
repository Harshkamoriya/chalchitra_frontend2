import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { verifyAccessToken, generateTokens } from "@/lib/jwt";
import { connect } from "mongoose";

export async function POST(req) {
  await connectToDB();

  const auth = req.headers.get("authorization");
  const token = auth?.split(" ")[1];

  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    // Toggle role
    user.role = user.role === "buyer" ? "seller" : "buyer";
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    return new Response(JSON.stringify({ accessToken, role: user.role }), {
      status: 200,
      headers: {
        "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return Response.json({ error: "Invalid token" }, { status: 401 });
  }
}
