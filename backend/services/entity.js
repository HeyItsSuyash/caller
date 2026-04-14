const { connect } = require('./mongodb');
const { ObjectId } = require('mongodb');

class EntityService {
  /**
   * Create a new entity
   */
  async createEntity(data) {
    const db = await connect();
    if (!db) throw new Error('DB connection failed');
    
    const entity = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Ensure userId is an ObjectId if it's a string
    if (typeof entity.userId === 'string') {
      entity.userId = new ObjectId(entity.userId);
    }
    
    const result = await db.collection('entities').insertOne(entity);
    return { ...entity, _id: result.insertedId };
  }

  /**
   * Get all entities for a specific user
   */
  async getEntitiesByUser(userId) {
    const db = await connect();
    if (!db) return [];
    const uid = typeof userId === 'string' ? new ObjectId(userId) : userId;
    return await db.collection('entities').find({ userId: uid }).toArray();
  }

  /**
   * Get all entities (Admin)
   */
  async getAllEntities() {
    const db = await connect();
    if (!db) return [];
    return await db.collection('entities').find({}).toArray();
  }

  /**
   * Get entity by ID
   */
  async getEntityById(id) {
    const db = await connect();
    if (!db) return null;
    return await db.collection('entities').findOne({ _id: new ObjectId(id) });
  }

  /**
   * Get entity by name (Case-insensitive)
   */
  async getEntityByName(name) {
    const db = await connect();
    if (!db) return null;
    return await db.collection('entities').findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
  }

  /**
   * Update entity (Owner check)
   */
  async updateEntity(id, userId, data) {
    const db = await connect();
    if (!db) return null;
    const result = await db.collection('entities').findOneAndUpdate(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result.value ? result.value : result; // Some versions of driver return the object directly
  }

  /**
   * Delete entity (Owner check)
   */
  /**
   * Delete entity (Owner check) and cascadingly delete its knowledge
   */
  async deleteEntity(id, userId) {
    const db = await connect();
    if (!db) return false;

    // 1. Fetch the entity to get its name (needed for knowledge cleanup)
    const entity = await db.collection('entities').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!entity) return false;

    // 2. Delete associated knowledge fragments
    // We use a case-insensitive regex to match the entity name
    await db.collection('knowledge').deleteMany({
      entity: { $regex: new RegExp(`^${entity.name}$`, 'i') }
    });

    console.log(`[EntityService] Cascading delete: Purged knowledge for agent "${entity.name}"`);

    // 3. Delete the entity itself
    const result = await db.collection('entities').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    return result.deletedCount > 0;
  }
}

module.exports = new EntityService();
