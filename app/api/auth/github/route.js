import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { generateTokens } from "@/lib/jwt";
import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

export async function GET(req) {
  await connectToDB();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Step 1: Exchange code for access token
  const tokenRes = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      code,
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      redirect_uri: GITHUB_REDIRECT_URI,
    },
    { headers: { Accept: "application/json" } }
  );

  const { access_token } = tokenRes.data;

  // Step 2: Get user info
  const profileRes = await axios.get(`https://api.github.com/user`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const emailRes = await axios.get(`https://api.github.com/user/emails`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const email = emailRes.data.find((e) => e.primary).email;
  const { login: name, id } = profileRes.data;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      githubId: id,
      role: "buyer",
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  return new Response(JSON.stringify({ accessToken }), {
    status: 200,
    headers: {
      "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
      "Content-Type": "application/json",
    },
  });
}
