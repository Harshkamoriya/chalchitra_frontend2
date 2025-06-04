import { connectToDB } from "@/lib/db";
import User from "@/models/user";

export async function DELETE(request) {
    
    try {


        await connectToDB();

      const user = await User.deleteMany({});

        return new Response(JSON.stringify({ success: true, message: "User deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error deleting user:", error.message);
        return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}