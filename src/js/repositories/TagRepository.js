import { API_ACTION_LISTING } from '../api/constant';
import { headers } from '../api/headers';
import models from '../models/index';

class TagRepository {
  async tags(tag) {
    const response = await fetch(`${API_ACTION_LISTING}/?_tag=${tag}&_active=true&limit=12`, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) throw new Error('Fetching profiles failed');

    try {
      const result = await response.json();
      const { data, meta } = result;

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

export default new TagRepository();