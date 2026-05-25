import { crmService } from '../services/crm.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const crmController = {
  // --- Customers ---
  async createCustomer(req, res, next) {
    try {
      const customer = await crmService.createCustomer(res.locals.tenantId, req.body);
      sendResponse(res, 201, customer, 'Customer created successfully');
    } catch (error) {
      next(error);
    }
  },

  async getCustomers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const { customers, total } = await crmService.getCustomers(res.locals.tenantId, { skip, take: limit, search: req.query.search });
      
      sendResponse(res, 200, {
        customers,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  },

  async getCustomerById(req, res, next) {
    try {
      const customer = await crmService.getCustomerById(req.params.id, res.locals.tenantId);
      sendResponse(res, 200, customer);
    } catch (error) {
      next(error);
    }
  },

  async updateCustomer(req, res, next) {
    try {
      const customer = await crmService.updateCustomer(req.params.id, res.locals.tenantId, req.body);
      sendResponse(res, 200, customer, 'Customer updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteCustomer(req, res, next) {
    try {
      await crmService.deleteCustomer(req.params.id, res.locals.tenantId);
      sendResponse(res, 200, null, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  // --- Leads ---
  async createLead(req, res, next) {
    try {
      const lead = await crmService.createLead(res.locals.tenantId, req.params.customerId, req.body);
      sendResponse(res, 201, lead, 'Lead created successfully');
    } catch (error) {
      next(error);
    }
  },

  async getLeads(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const { leads, total } = await crmService.getLeads(res.locals.tenantId, { skip, take: limit, stage: req.query.stage });
      
      sendResponse(res, 200, {
        leads,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  },

  async updateLead(req, res, next) {
    try {
      const lead = await crmService.updateLead(req.params.id, res.locals.tenantId, req.body);
      sendResponse(res, 200, lead, 'Lead updated successfully');
    } catch (error) {
      next(error);
    }
  },

  // --- Notes ---
  async addNoteToCustomer(req, res, next) {
    try {
      const note = await crmService.addNoteToCustomer(res.locals.tenantId, req.params.customerId, req.user.id, req.body.body);
      sendResponse(res, 201, note, 'Note added successfully');
    } catch (error) {
      next(error);
    }
  }
};
