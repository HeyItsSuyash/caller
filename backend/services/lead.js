const prisma = require('./db');

class LeadService {
  /**
   * Create a new lead
   */
  async createLead(data) {
    const { entity_id, phone, status, ...restData } = data;

    const lead = await prisma.lead.create({
      data: {
        entity_id,
        phone,
        status: status || 'new',
        data: Object.keys(restData).length > 0 ? restData : undefined
      }
    });

    return lead;
  }

  /**
   * Get leads for an entity or user
   */
  async getLeads(query = {}) {
    const where = {};
    if (query.entity_id) where.entity_id = query.entity_id;
    if (query.phone) where.phone = query.phone;

    return await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Update lead status or info
   */
  async updateLead(id, data) {
    const { entity_id, phone, status, ...restData } = data;

    // To merge JSON `data` if necessary, we can just replace it for simplicity, 
    // or fetch the old one and merge. Here we replace.
    const updatePayload = {};
    if (entity_id !== undefined) updatePayload.entity_id = entity_id;
    if (phone !== undefined) updatePayload.phone = phone;
    if (status !== undefined) updatePayload.status = status;
    if (Object.keys(restData).length > 0) updatePayload.data = restData;

    return await prisma.lead.update({
      where: { id },
      data: updatePayload
    });
  }
}

module.exports = new LeadService();
