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
export async function PUT(request, { params }) {
  let client;
  try {
    const { id } = await params;
    const body = await request.json();

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

    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    // Parse the date string or use current date
    let memoryDate;
    try {
      memoryDate = body.date ? new Date(body.date) : new Date();
    } catch (err) {
      memoryDate = new Date();
    }

    // Prepare update data
    const updateData = {
      ...body,
      date: memoryDate,
      updatedAt: new Date(),
    };

    // Don't allow updating the _id field
    delete updateData._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Memory not found",
        },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updatedMemory = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Memory updated successfully",
      data: updatedMemory,
    });
  } catch (error) {
    console.error("Error updating memory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update memory",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// DELETE - Delete a memory by ID
export async function DELETE(request, { params }) {
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

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Memory not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Memory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting memory:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete memory",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
