import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import environment from "@/config/environment";

// MongoDB connection details
const uri = process.env.MONGODB_URI || environment.mongodb.uri;
const dbName = environment.mongodb.dbName;
const collectionName = environment.mongodb.collections.restaurants;

// Helper to get collection and client
async function getCollection() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { collection: db.collection(collectionName), client };
}

// GET - list all restaurants (newest first by createdAt)
export async function GET() {
  let client;
  try {
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;
    const restaurants = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch restaurants",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}

// POST - create a restaurant { name, description }
export async function POST(request) {
  let client;
  try {
    const body = await request.json();
    const { name, description } = body || {};

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Restaurant name is required" },
        { status: 400 }
      );
    }

    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    const now = new Date();
    const doc = {
      name: name.trim(),
      description: (description || "").trim(),
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);
    return NextResponse.json(
      {
        success: true,
        message: "Restaurant added",
        data: { ...doc, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create restaurant",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
