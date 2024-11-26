import { API_ACTION_LISTING } from '../api/constant';
import { headers } from '../api/headers';
import models from '../models/index';

class SearchRRepository {
  async listings(query, page = 1) {
    const endpoint = `${API_ACTION_LISTING}/search?q=${query}&limit=12&page=${page}&_bids=true&_seller=true`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API error: ${response.status} ${response.statusText}. Details: ${errorBody}`
        );
      }

      const { data, meta } = await response.json();
      return {
        success: true,
        data: new models.Listings(data),
        meta,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default new SearchRRepository();