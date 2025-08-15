import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import environment from "@/config/environment";

// MongoDB connection details
const uri = process.env.MONGODB_URI || environment.mongodb.uri;
const dbName = environment.mongodb.dbName;
const collectionName = environment.mongodb.collections.memories;

// Helper function to get database connection
async function getCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return {
    collection: db.collection(collectionName),
    client,
  };
}

// GET - Fetch all memories (sorted by date, newest first)
export async function GET() {
  let client;
  try {
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    // Get all memories, sorted by date (newest first)
    const memories = await collection.find({}).sort({ date: -1 }).toArray();

    return NextResponse.json({ success: true, data: memories });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch memories",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// POST - Create a new memory with image
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    // Validate required fields
    if (!body.title || !body.description || !body.imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and image are required",
        },
        { status: 400 }
      );
    }

    // Parse the date string or use current date
    let memoryDate;
    try {
      memoryDate = body.date ? new Date(body.date) : new Date();
    } catch (err) {
      memoryDate = new Date();
    }

    // Create a new memory document
    const newMemory = {
      title: body.title,
      description: body.description,
      date: memoryDate,
      imageUrl: body.imageUrl, // Base64 encoded image or URL
      tags: body.tags || [], // Array of tag strings
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newMemory);

    return NextResponse.json(
      {
        success: true,
        message: "Memory created successfully",
        data: { ...newMemory, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating memory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create memory",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
