import { NextResponse } from "next/server";

// Update these values to your special date
// For example, if your special date is January 5:
// const CORRECT_DAY = "5";
// const CORRECT_MONTH = "1";
const CORRECT_DAY = "13"; // Anniversary day
const CORRECT_MONTH = "07"; // July (1-12)

export async function POST(request) {
  try {
    const body = await request.json();
    const { day, month } = body;

    // Validate inputs
    if (!day || !month) {
      return NextResponse.json(
        { success: false, message: "Enter our anniversary date my love 💖" },
        { status: 400 }
      );
    }

    // Convert to strings for comparison (to handle inputs like "02" or 2)
    const dayStr = day.toString();
    const monthStr = month.toString();

    // Check if credentials match
    if (dayStr === CORRECT_DAY && monthStr === CORRECT_MONTH) {
      // Create a response with success message
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      // Set the auth cookie directly on the response
      response.cookies.set({
        name: "auth",
        value: "authenticated",
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
        sameSite: "strict",
      });

      return response;
    } else {
      // Wrong credentials
      return NextResponse.json(
        { success: false, message: "Use our anniversary date my love" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
