// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectToDB } from "@/lib/db";


export const authenticateUser = async (req) => {
  try {
    console.log("Reading Authorization header...");
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided");
      return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("Decoded JWT:", decoded);

    await connectToDB();

    const user = await User.findOne({ _id: decoded.id});
    console.log("Found user from DB:", user);

    if (!user) {
      console.log("User not found in DB");
      return new Response(JSON.stringify({ error: "Unauthorized: User not found" }), {
        status: 401,
      });
    }

    console.log("Authentication successful");
    return { user };
  } catch (err) {
    console.error("Auth error:", err.message);
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
      status: 401,
    });
  }
};


// export const authenticateUser = async (req) => {
//   try {
//     const authHeader = req.headers.get("authorization");

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       // return null;
//       return new Response(JSON.stringify({ error: "Unauthorized: No token provided" }), {
//         status: 401,
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

//     await connectToDB(); // Ensure DB connection
//     const user = await User.findOne({ email: decoded.id });

//     if (!user) {
//       return new Response(JSON.stringify({ error: "Unauthorized: User not found" }), {
//         status: 401,
//       });
//     }

//     // Success: return the user
//     console.log("user in the autherticate user" , user)
//     return { user };
//   } catch (err) {
//     console.error("Auth error:", err.message);
//     return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
//       status: 401,
//     });
//   }
// };
