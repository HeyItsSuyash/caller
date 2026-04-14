const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'caller_ai';

let client;
let db;

async function connect() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(uri);
  }
  await client.connect();
  db = client.db(dbName);
  return db;
}

/**
 * Find user by email.
 */
async function findUserByEmail(email) {
  try {
    const database = await connect();
    return await database.collection('users').findOne({ email: email.toLowerCase() });
  } catch (err) {
    console.error(`[UserService] findUserByEmail error:`, err.message);
    throw err;
  }
}

/**
 * Find user by ID.
 */
async function findUserById(id) {
  try {
    const database = await connect();
    return await database.collection('users').findOne({ _id: new ObjectId(id) });
  } catch (err) {
    console.error(`[UserService] findUserById error:`, err.message);
    throw err;
  }
}

/**
 * Create a new user.
 */
async function createUser(userData) {
  try {
    const database = await connect();
    const user = {
      ...userData,
      email: userData.email.toLowerCase(),
      role: userData.role || 'user',
      created_at: new Date().toISOString()
    };
    const result = await database.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  } catch (err) {
    console.error(`[UserService] createUser error:`, err.message);
    throw err;
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
