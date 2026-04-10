const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'caller_ai';

// Initialize client only if URI exists to avoid immediate crash
let client;
if (uri) {
  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2000, // Connection timeout in 2 seconds
      connectTimeoutMS: 2000
    });
  } catch (err) {
    console.error('[MongoDB] Initialization error:', err.message);
  }
}

let db;

async function connect() {
  if (!uri || !client) {
    return null; 
  }
  if (db) return db;

  try {
    // Attempt connection
    await client.connect();
    db = client.db(dbName);
    console.log(`[MongoDB] Connected successfully to database: ${dbName}`);
    
    // Create index in background without awaiting to prevent startup hang
    db.collection('analytics').createIndex({ phone_number: 1 }, { unique: true }).catch(e => {
        console.warn('[MongoDB] Index creation failed:', e.message);
    });
    
    return db;
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message);
    // Return null so that service functions can fallback gracefully
    return null;
  }
}

/**
 * Fetch interaction history for a specific phone number.
 */
async function getCallMemory(phoneNumber) {
  try {
    const database = await connect();
    if (!database) return [];
    
    const result = await database.collection('analytics').findOne({ phone_number: phoneNumber });
    
    if (!result) return [];
    return result.summaries || [];
  } catch (err) {
    console.error(`[MongoDB] Error fetching memory for ${phoneNumber}:`, err.message);
    return [];
  }
}

/**
 * Add a new summary to the phone number's history.
 */
async function saveCallSummary(phoneNumber, summaryData) {
  try {
    const database = await connect();
    if (!database) {
        console.warn('[MongoDB] Skipping save: No connection.');
        return;
    }
    
    // 1. Fetch existing summaries
    const existing = await database.collection('analytics').findOne({ phone_number: phoneNumber });
    let updatedSummaries = existing ? (existing.summaries || []) : [];

    // 2. Append new summary
    updatedSummaries.unshift({
      text: summaryData.summary,
      timestamp: new Date().toISOString(),
      intent: summaryData.key_intent || summaryData.key_topics?.[0] || 'unknown',
      details: summaryData.important_details || summaryData.entities || {}
    });

    // 3. Upsert
    await database.collection('analytics').updateOne(
      { phone_number: phoneNumber },
      { 
        $set: { 
          summaries: updatedSummaries,
          updated_at: new Date().toISOString()
        } 
      },
      { upsert: true }
    );

    console.log(`[MongoDB] Upsert completed for ${phoneNumber}`);
  } catch (err) {
    console.error(`[MongoDB] Error saving summary for ${phoneNumber}:`, err.message);
  }
}

/**
 * Fetch all analytics data for the dashboard.
 */
async function getAllAnalytics() {
  try {
    const database = await connect();
    if (!database) return [];
    
    const results = await database.collection('analytics')
      .find({})
      .sort({ updated_at: -1 })
      .toArray();
      
    return results;
  } catch (err) {
    console.error('[MongoDB] Error fetching all analytics:', err.message);
    return [];
  }
}

/**
 * Fetch all knowledge source documents/text blocks.
 */
async function getKnowledge() {
  try {
    const database = await connect();
    if (!database) return [];
    
    return await database.collection('knowledge')
      .find({})
      .sort({ created_at: -1 })
      .toArray();
  } catch (err) {
    console.error('[MongoDB] Error fetching knowledge:', err.message);
    return [];
  }
}

/**
 * Add a new knowledge source.
 */
async function addKnowledge(data) {
  try {
    const database = await connect();
    if (!database) return null;
    
    const doc = {
      ...data,
      created_at: new Date().toISOString()
    };
    
    const result = await database.collection('knowledge').insertOne(doc);
    return { ...doc, _id: result.insertedId };
  } catch (err) {
    console.error('[MongoDB] Error adding knowledge:', err.message);
    return null;
  }
}

/**
 * Delete a knowledge source.
 */
async function deleteKnowledge(id) {
  try {
    const database = await connect();
    if (!database) return false;
    
    const { ObjectId } = require('mongodb');
    const result = await database.collection('knowledge').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (err) {
    console.error('[MongoDB] Error deleting knowledge:', err.message);
    return false;
  }
}

module.exports = {
  getCallMemory,
  saveCallSummary,
  getAllAnalytics,
  getKnowledge,
  addKnowledge,
  deleteKnowledge
};
