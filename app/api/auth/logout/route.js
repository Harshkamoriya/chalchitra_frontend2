export async function POST(req) {
  try {
    // Clear refreshToken by setting it to empty & expired
    const response = new Response(JSON.stringify({ message: "Logged out" }), {
      status: 200,
    });

    response.headers.set(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
    );

    // Optional: also clear accessToken (non-HttpOnly) on logout
    response.headers.append(
      "Set-Cookie",
      "accessToken=; Path=/; Max-Age=0; SameSite=Strict"
    );

    return response;

  } catch (err) {
    console.error("Logout failed:", err);
    return new Response(JSON.stringify({ error: "Logout failed" }), {
      status: 500,
    });
  }
}
