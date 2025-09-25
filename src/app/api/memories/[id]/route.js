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

// GET - Fetch a single memory by ID
export async function GET(request, { params }) {
  let client;
  try {
    const { id } = await params;

    // Validate ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid memory ID format",
        },
        { status: 400 }
      );
    }

    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    const memory = await collection.findOne({ _id: new ObjectId(id) });

    if (!memory) {
      return NextResponse.json(
        {
          success: false,
          message: "Memory not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: memory });
  } catch (error) {
    console.error("Error fetching memory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch memory",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// PUT - Update a memory by ID
export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message: "Editing memories is disabled. Memories are permanent.",
    },
    { status: 405 }
  );
}

// DELETE - Delete a memory by ID
export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      message: "Deleting memories is disabled. Memories are permanent.",
    },
    { status: 405 }
  );
}
