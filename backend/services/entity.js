const prisma = require('./db');

class EntityService {
  /**
   * Create a new entity
   */
  async createEntity(data) {
    const { userId, name, purpose, voice_model, instructions } = data;
    
    const entity = await prisma.entity.create({
      data: {
        userId,
        name,
        purpose,
        voice_model: voice_model || "Google Standard",
        instructions: instructions || ""
      }
    });
    
    return entity;
  }

  /**
   * Get all entities for a specific user
   */
  async getEntitiesByUser(userId) {
    return await prisma.entity.findMany({
      where: { userId }
    });
  }

  /**
   * Get all entities (Admin)
   */
  async getAllEntities() {
    return await prisma.entity.findMany();
  }

  /**
   * Get entity by ID
   */
  async getEntityById(id) {
    return await prisma.entity.findUnique({
      where: { id }
    });
  }

  /**
   * Get entity by name (Case-insensitive)
   */
  async getEntityByName(name) {
    return await prisma.entity.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
  }

  /**
   * Update entity (Owner check)
   */
  async updateEntity(id, userId, data) {
    // Check ownership first
    const existing = await prisma.entity.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return null;
    }

    const { name, purpose, voice_model, instructions } = data;
    
    return await prisma.entity.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        purpose: purpose !== undefined ? purpose : undefined,
        voice_model: voice_model !== undefined ? voice_model : undefined,
        instructions: instructions !== undefined ? instructions : undefined
      }
    });
  }

  /**
   * Delete entity (Owner check) and cascadingly delete its knowledge
   */
  async deleteEntity(id, userId) {
    // 1. Fetch the entity
    const entity = await prisma.entity.findUnique({
      where: { id }
    });

    if (!entity || entity.userId !== userId) return false;

    // 2. Delete associated knowledge fragments
    await prisma.knowledge.deleteMany({
      where: {
        entity: {
          equals: entity.name,
          mode: 'insensitive'
        }
      }
    });

    console.log(`[EntityService] Cascading delete: Purged knowledge for agent "${entity.name}"`);

    // 3. Delete the entity itself
    await prisma.entity.delete({
      where: { id }
    });

    return true;
  }
}

module.exports = new EntityService();
