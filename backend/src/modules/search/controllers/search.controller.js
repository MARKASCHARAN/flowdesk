import { searchService } from '../services/search.service.js';
import { sendResponse } from '../../../infra/utils/response.js';

export const searchController = {
  async globalSearch(req, res, next) {
    try {
      const results = await searchService.globalSearch(
        res.locals.tenantId,
        req.query.q,
        parseInt(req.query.limit)
      );
      sendResponse(res, 200, results);
    } catch (error) {
      next(error);
    }
  },
};
