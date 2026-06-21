import { searchRepository } from '../repositories/search.repository.js';
import { AppError } from '../../../infra/errors/AppError.js';

export const searchService = {
  async globalSearch(tenantId, query, limit = 10) {
    if (!query || query.length < 2) {
      throw new AppError(
        400,
        'Search query must be at least 2 characters long'
      );
    }

    // We can implement caching via Redis here to prevent hammering DB on frequent searches

    return searchRepository.searchGlobal(tenantId, query, limit);
  },
};
