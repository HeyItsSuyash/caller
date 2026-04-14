require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

async function clearAnalytics() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("caller_ai");
    console.log("Clearing 'analytics' collection to remove old hallucinations...");
    const result = await db.collection('analytics').deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} analytics records.`);
  } catch (err) {
    console.error("Error clearing analytics:", err.message);
  } finally {
    await client.close();
  }
}

clearAnalytics();
