import { NextResponse } from "next/server";

export async function GET() {
  // Create a response
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Delete the auth cookie directly from the response
  response.cookies.delete("auth");

  return response;
}
