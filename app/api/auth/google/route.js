import { connectToDB } from "@/lib/db";
import User from "@/models/user";
import { generateTokens } from "@/lib/jwt";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(req) {
  console.log("🔁 [OAuth] Starting Google OAuth flow");

  try {
    await connectToDB();
    console.log("✅ [OAuth] Connected to DB");

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const from = url.searchParams.get("state") || "/"; // original page

    console.log("🔎 [OAuth] Received code:", code);
    console.log("📍 [OAuth] Redirect state (from):", from);

    if (!code) {
      console.error("❌ [OAuth] No code provided");
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
      });
    }

    // Step 1: Exchange code for access token
    let tokenRes;
    try {
      tokenRes = await axios.post(
        `https://oauth2.googleapis.com/token`,
        {
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ [OAuth] Token response received");
    } catch (tokenErr) {
      console.error(
        "❌ [OAuth] Failed to exchange code for token:",
        tokenErr.response?.data || tokenErr.message
      );
      return new Response(
        JSON.stringify({ error: "Failed to exchange code" }),
        { status: 401 }
      );
    }

    const { access_token } = tokenRes.data;
    if (!access_token) {
      console.error("❌ [OAuth] No access token in response");
      return new Response(
        JSON.stringify({ error: "No access token from Google" }),
        { status: 401 }
      );
    }

    // Step 2: Fetch user profile
    let profileRes;
    try {
      profileRes = await axios.get(
        `https://www.googleapis.com/oauth2/v2/userinfo`,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );
      console.log("✅ [OAuth] Google profile fetched");
    } catch (profileErr) {
      console.error(
        "❌ [OAuth] Failed to fetch Google profile:",
        profileErr.response?.data || profileErr.message
      );
      return new Response(
        JSON.stringify({ error: "Failed to fetch Google profile" }),
        { status: 403 }
      );
    }

    const { email, name, id } = profileRes.data;
    console.log("👤 [OAuth] User info:", { email, name, id });

    if (!email) {
      console.error("❌ [OAuth] Email missing in profile");
      return new Response(
        JSON.stringify({ error: "Missing email in Google profile" }),
        { status: 403 }
      );
    }

    // Step 3: Find or create user
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          name,
          googleId: id,
          role: "buyer",
        });
        console.log("✅ [OAuth] New user created");
      } else {
        console.log("✅ [OAuth] User already exists");
      }
    } catch (dbErr) {
      console.error(
        "❌ [OAuth] DB error when fetching/creating user:",
        dbErr.message
      );
      return new Response(JSON.stringify({ error: "User DB error" }), {
        status: 500,
      });
    }

    // Step 4: Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user);
    console.log("🔑 [OAuth] JWT tokens generated");

    // Step 5: Set cookies
    const responseHeaders = new Headers();

    // accessToken → non-HttpOnly, short-lived (e.g., 15 min)
    responseHeaders.append(
      "Set-Cookie",
      `accessToken=${accessToken}; Path=/; Max-Age=900; SameSite=Strict`
    );

    // refreshToken → HttpOnly, longer (e.g., 7 days)
    responseHeaders.append(
      "Set-Cookie",
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`
    );

    // Step 6: Redirect to original page
    // const redirectUrl = `${FRONTEND_BASE_URL}${from}`;
    let redirectUrl;
    if (from.startsWith("http")) {
      redirectUrl = from;
    } else {
      redirectUrl = `${FRONTEND_BASE_URL}${from}`;
    }
    responseHeaders.set("Location", redirectUrl);
    console.log("🚀 [OAuth] Redirecting to frontend:", redirectUrl);

    return new Response(null, {
      status: 302,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("🔥 [OAuth] Uncaught error:", err.message, err.stack);
    return new Response(JSON.stringify({ error: "Google OAuth failed" }), {
      status: 500,
    });
  }
}

// import { connectToDB } from "@/lib/db";
// import User from "@/models/user";
// import { generateTokens } from "@/lib/jwt";
// import axios from "axios";

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
// const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// export async function GET(req) {
//   console.log("🔁 [OAuth] Starting Google OAuth flow");

//   try {
//     await connectToDB();
//     console.log("✅ [OAuth] Connected to DB");

//     const url = new URL(req.url);
//     const code = url.searchParams.get("code");
//     const from = url.searchParams.get("state") || "/"; // original page

//     console.log("🔎 [OAuth] Received code:", code);
//     console.log("📍 [OAuth] Redirect state (from):", from);

//     if (!code) {
//       console.error("❌ [OAuth] No code provided");
//       return new Response(JSON.stringify({ error: "No code provided" }), { status: 400 });
//     }

//     // Step 1: Exchange code for access token
//     let tokenRes;
//     try {
//       tokenRes = await axios.post(
//         `https://oauth2.googleapis.com/token`,
//         {
//           code,
//           client_id: GOOGLE_CLIENT_ID,
//           client_secret: GOOGLE_CLIENT_SECRET,
//           redirect_uri: GOOGLE_REDIRECT_URI,
//           grant_type: "authorization_code",
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       console.log("✅ [OAuth] Token response received");
//     } catch (tokenErr) {
//       console.error("❌ [OAuth] Failed to exchange code for token:", tokenErr.response?.data || tokenErr.message);
//       return new Response(JSON.stringify({ error: "Failed to exchange code" }), { status: 401 });
//     }

//     const { access_token } = tokenRes.data;
//     if (!access_token) {
//       console.error("❌ [OAuth] No access token in response");
//       return new Response(JSON.stringify({ error: "No access token from Google" }), { status: 401 });
//     }

//     // Step 2: Fetch user profile
//     let profileRes;
//     try {
//       profileRes = await axios.get(
//         `https://www.googleapis.com/oauth2/v2/userinfo`,
//         { headers: { Authorization: `Bearer ${access_token}` } }
//       );
//       console.log("✅ [OAuth] Google profile fetched");
//     } catch (profileErr) {
//       console.error("❌ [OAuth] Failed to fetch Google profile:", profileErr.response?.data || profileErr.message);
//       return new Response(JSON.stringify({ error: "Failed to fetch Google profile" }), { status: 403 });
//     }

//     const { email, name, id } = profileRes.data;
//     console.log("👤 [OAuth] User info:", { email, name, id });

//     if (!email) {
//       console.error("❌ [OAuth] Email missing in profile");
//       return new Response(JSON.stringify({ error: "Missing email in Google profile" }), { status: 403 });
//     }

//     // Step 3: Find or create user
//     let user;
//     try {
//       user = await User.findOne({ email });
//       if (!user) {
//         user = await User.create({
//           email,
//           name,
//           googleId: id,
//           role: "buyer",
//         });
//         console.log("✅ [OAuth] New user created");
//       } else {
//         console.log("✅ [OAuth] User already exists");
//       }
//     } catch (dbErr) {
//       console.error("❌ [OAuth] DB error when fetching/creating user:", dbErr.message);
//       return new Response(JSON.stringify({ error: "User DB error" }), { status: 500 });
//     }

//     // Step 4: Generate JWT tokens
//     const { accessToken, refreshToken } = generateTokens(user);
//     console.log("🔑 [OAuth] JWT tokens generated");

//     // Step 5: Set secure cookie
//     const responseHeaders = new Headers({
//       "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`,
//     });

//     // Step 6: Redirect back to frontend
//     const redirectUrl = `${FRONTEND_BASE_URL}/oauth_redirect?from=${encodeURIComponent(from)}`;
//     responseHeaders.set("Location", redirectUrl);

//     console.log("🚀 [OAuth] Redirecting to frontend:", redirectUrl);

//     return new Response(null, {
//       status: 302,
//       headers: responseHeaders,
//     });

//   } catch (err) {
//     console.error("🔥 [OAuth] Uncaught error:", err.message, err.stack);
//     return new Response(JSON.stringify({ error: "Google OAuth failed" }), { status: 500 });
//   }
// }
