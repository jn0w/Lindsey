import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import environment from "@/config/environment";

// MongoDB connection string
const uri = process.env.MONGODB_URI || environment.mongodb.uri;

export async function GET() {
  try {
    // Create a MongoClient
    const client = new MongoClient(uri);

    // Connect to the MongoDB server
    await client.connect();

    // Test the connection by accessing the admin database
    await client.db("admin").command({ ping: 1 });

    // Close the connection
    await client.close();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful!",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
