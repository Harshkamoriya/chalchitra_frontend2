export async function POST(req) {
  try {
    // Optional: clear refresh token cookie (if you're using it)
    const response = new Response(JSON.stringify({ message: "Logged out" }), {
      status: 200,
    });

    response.headers.set(
      "Set-Cookie",
      "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict"
    );

    return response;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Logout failed" }), {
      status: 500,
    });
  }
}
