require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

async function test() {
  console.log("Connecting...");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log("Connected!");
    const db = client.db("caller_ai");
    
    const doc = {
        title: "Test Admission",
        content: "The admission fee is 50,000 INR.",
        entity: "Admission Bot",
        type: "TEXT",
        created_at: new Date().toISOString()
    };
    
    console.log("Inserting test knowledge...");
    const res = await db.collection('knowledge').insertOne(doc);
    console.log("Inserted ID:", res.insertedId);
    
    const count = await db.collection('knowledge').countDocuments();
    console.log("Total knowledge count:", count);
    
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.close();
  }
}

test();
