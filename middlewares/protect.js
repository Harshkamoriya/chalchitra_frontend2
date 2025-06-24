

import { verifyAccessToken } from "@/lib/jwt";


export function protectRoute(handler) {
  return async (req) => {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      return handler(req);
    } catch (err) {
      return Response.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  };
}
// the below function bakcend logic routes me add karsakte ho user role aur protected routes ke liye
// export function onlySeller(req) {
//   const token = req.headers.get("authorization")?.split(" ")[1];
//   const decoded = verifyAccessToken(token);

//   if (decoded.role !== "seller") {
//     return Response.json({ error: "Forbidden" }, { status: 403 });
//   }
// }
