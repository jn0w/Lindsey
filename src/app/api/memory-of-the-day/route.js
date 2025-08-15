import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
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

export async function GET() {
  let client;
  try {
    console.log("🔄 [API] Starting memory-of-the-day request...");
    const { collection, client: mongoClient } = await getCollection();
    client = mongoClient;

    // Get all memories
    const allMemories = await collection.find({}).toArray();
    console.log("📊 [API] Found memories count:", allMemories.length);

    if (allMemories.length === 0) {
      console.log("❌ [API] No memories found, returning null");
      return NextResponse.json({ memoryOfTheDay: null });
    }

    // Use current date as seed for consistent daily selection
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Simple hash function to convert date to index
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Get positive index within array bounds
    const index = Math.abs(hash) % allMemories.length;
    const memoryOfTheDay = allMemories[index];

    console.log(
      "✅ [API] Selected memory:",
      memoryOfTheDay.title,
      "at index:",
      index
    );

    return NextResponse.json({
      memoryOfTheDay,
      date: dateString,
    });
  } catch (error) {
    console.error("Error fetching memory of the day:", error);
    return NextResponse.json(
      { error: "Failed to fetch memory of the day" },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
