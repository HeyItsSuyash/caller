const { connect } = require('./mongodb');
const { ObjectId } = require('mongodb');

class LeadService {
  /**
   * Create a new lead
   */
  async createLead(data) {
    const db = await connect();
    if (!db) throw new Error('DB connection failed');

    const lead = {
      ...data,
      status: data.status || 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (data.entity_id && typeof data.entity_id === 'string') {
      lead.entity_id = new ObjectId(data.entity_id);
    }

    const result = await db.collection('leads').insertOne(lead);
    return { ...lead, _id: result.insertedId };
  }

  /**
   * Get leads for an entity or user
   */
  async getLeads(query = {}) {
    const db = await connect();
    if (!db) return [];

    const mongoQuery = {};
    if (query.entity_id) mongoQuery.entity_id = new ObjectId(query.entity_id);
    if (query.phone) mongoQuery.phone = query.phone;

    return await db.collection('leads')
      .find(mongoQuery)
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Update lead status or info
   */
  async updateLead(id, data) {
    const db = await connect();
    if (!db) return null;

    const result = await db.collection('leads').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result.value || result;
  }
}

module.exports = new LeadService();
