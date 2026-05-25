import { crmRepository } from '../repositories/crm.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const crmService = {
  // --- Customers ---
  async createCustomer(tenantId, data) {
    try {
      return await crmRepository.createCustomer(tenantId, data);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(400, 'A customer with this email already exists');
      }
      throw error;
    }
  },

  async getCustomers(tenantId, options) {
    return crmRepository.findCustomers(tenantId, options);
  },

  async getCustomerById(id, tenantId) {
    const customer = await crmRepository.findCustomerById(id, tenantId);
    if (!customer) throw new AppError(404, 'Customer not found');
    return customer;
  },

  async updateCustomer(id, tenantId, data) {
    try {
      const customer = await crmRepository.updateCustomer(id, tenantId, data);
      if (!customer) throw new AppError(404, 'Customer not found');
      return customer;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError(400, 'A customer with this email already exists');
      }
      throw error;
    }
  },

  async deleteCustomer(id, tenantId) {
    const customer = await crmRepository.deleteCustomer(id, tenantId);
    if (!customer) throw new AppError(404, 'Customer not found');
  },

  // --- Leads ---
  async createLead(tenantId, customerId, data) {
    // Ensure customer exists
    const customer = await crmRepository.findCustomerById(customerId, tenantId);
    if (!customer) throw new AppError(404, 'Customer not found');

    return crmRepository.createLead(tenantId, { customerId, ...data });
  },

  async getLeads(tenantId, options) {
    return crmRepository.findLeads(tenantId, options);
  },

  async updateLead(id, tenantId, data) {
    const lead = await crmRepository.updateLead(id, tenantId, data);
    if (!lead) throw new AppError(404, 'Lead not found');
    return lead;
  },

  // --- Notes ---
  async addNoteToCustomer(tenantId, customerId, userId, body) {
    const customer = await crmRepository.findCustomerById(customerId, tenantId);
    if (!customer) throw new AppError(404, 'Customer not found');

    return crmRepository.createNote(tenantId, customerId, userId, body);
  }
};
