const { MongoClient, ObjectId } = require('mongodb');

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

let isConnecting = false;

async function connect() {
  if (!uri || !client) return null;
  if (db) return db;
  if (isConnecting) {
      // Wait a bit if already connecting to avoid multiple parallel attempts
      await new Promise(resolve => setTimeout(resolve, 500));
      if (db) return db;
  }

  isConnecting = true;
  try {
    console.log('[MongoDB] Attempting to connect...');
    // We use a timeout because sometimes client.connect() hangs indefinitely on Windows/certain networks
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timed out')), 5000)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    db = client.db(dbName);
    console.log(`[MongoDB] Connected successfully to database: ${dbName}`);
    return db;
  } catch (err) {
    console.error(`[MongoDB] Connection error:`, err.message);
    return null;
  } finally {
    isConnecting = false;
  }
}

/**
 * Save a complete call record to the database.
 */
async function saveCall(callData) {
  try {
    const database = await connect();
    if (!database) return null;

    const record = {
      ...callData,
      createdAt: new Date(),
      entity_id: callData.entity_id ? new ObjectId(callData.entity_id) : null
    };

    const result = await database.collection('calls').insertOne(record);
    
    // Also update the legacy analytics collection for backward compatibility
    await saveCallSummary(callData.phone, callData);

    return { ...record, _id: result.insertedId };
  } catch (err) {
    console.error('[MongoDB] Error saving call:', err.message);
    return null;
  }
}

/**
 * Fetch calls for a specific entity with basic analytics.
 */
async function getEntityCalls(entityId) {
  try {
    const database = await connect();
    if (!database) return [];

    return await database.collection('calls')
      .find({ entity_id: new ObjectId(entityId) })
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.error('[MongoDB] Error fetching entity calls:', err.message);
    return [];
  }
}

/**
 * Fetch interaction history for a specific phone number.
 */
async function getCallMemory(phoneNumber) {
  try {
    const database = await connect();
    if (!database) return [];
    
    // Search in the new calls collection first
    const calls = await database.collection('calls')
      .find({ phone: phoneNumber })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    if (calls.length > 0) {
      return calls.map(c => ({
        text: c.summary,
        timestamp: c.createdAt,
        intent: c.intent
      }));
    }

    // Fallback to legacy analytics
    const result = await database.collection('analytics').findOne({ phone_number: phoneNumber });
    if (!result) return [];
    return result.summaries || [];
  } catch (err) {
    console.error(`[MongoDB] Error fetching memory for ${phoneNumber}:`, err.message);
    return [];
  }
}

/**
 * Add a new summary to the phone number's history (Legacy support).
 */
async function saveCallSummary(phoneNumber, summaryData) {
  try {
    const database = await connect();
    if (!database) return;
    
    const existing = await database.collection('analytics').findOne({ phone_number: phoneNumber });
    let updatedSummaries = existing ? (existing.summaries || []) : [];

    updatedSummaries.unshift({
      text: summaryData.summary,
      timestamp: new Date().toISOString(),
      intent: summaryData.intent || summaryData.key_intent || 'unknown',
      details: summaryData.important_details || {}
    });

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
  } catch (err) {
    console.error(`[MongoDB] Error saving summary for ${phoneNumber}:`, err.message);
  }
}

/**
 * Fetch all analytics data for the dashboard (Global Admin).
 */
async function getAllAnalytics() {
  try {
    const database = await connect();
    if (!database) return [];
    
    return await database.collection('calls')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  } catch (err) {
    console.error('[MongoDB] Error fetching all analytics:', err.message);
    return [];
  }
}

/**
 * Fetch all knowledge source documents/text blocks.
 */
async function getKnowledge(entity) {
  try {
    const database = await connect();
    if (!database) return [];
    
    const query = (entity && entity !== 'unknown')
      ? { entity: { $regex: new RegExp(`^${entity}$`, 'i') } }
      : { 
          $or: [
            { entity: { $exists: false } },
            { entity: null },
            { entity: "" }
          ] 
        };
    
    return await database.collection('knowledge')
      .find(query)
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
  connect,
  getDb: () => db,
  closeConnection: () => client && client.close(),
  saveCall,
  getEntityCalls,
  getCallMemory,
  saveCallSummary,
  getAllAnalytics,
  getKnowledge,
  addKnowledge,
  deleteKnowledge
};
