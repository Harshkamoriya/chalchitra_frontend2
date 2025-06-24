import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { generateTokens } from "@/lib/jwt";

const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(req) {
  await connectToDB();

  try {
    const cookies = req.headers.get("cookie") || "";
    const refreshToken = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // ✅ Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // ✅ Find user and issue new tokens
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    const res = NextResponse.json({ accessToken });

    // ✅ Set new refresh token in cookie
    res.headers.set(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
    );

    return res;
  } catch (err) {
    console.error("Refresh error:", err);
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 403 });
  }
}
