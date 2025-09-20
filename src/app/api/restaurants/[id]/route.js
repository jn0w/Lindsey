import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import environment from "@/config/environment";

// MongoDB connection details
const uri = process.env.MONGODB_URI || environment.mongodb.uri;
const dbName = environment.mongodb.dbName;
const collectionName = environment.mongodb.collections.restaurants;

async function getCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { collection: db.collection(collectionName), client };
}

// GET by id
export async function GET(request, { params }) {
  let client;
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;
    const doc = await collection.findOne({ _id: new ObjectId(id) });
    if (!doc) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch restaurant",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// PUT update { name?, description? }
export async function PUT(request, { params }) {
  let client;
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const updateData = {};
    if (typeof body.name === "string") updateData.name = body.name.trim();
    if (typeof body.description === "string")
      updateData.description = body.description.trim();
    updateData.updatedAt = new Date();

    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }
    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      success: true,
      message: "Restaurant updated",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update restaurant",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// DELETE by id
export async function DELETE(request, { params }) {
  let client;
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Restaurant not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Restaurant deleted" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete restaurant",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
