import { API_ACTION_PROFILES } from '../api/constant';
import { headers } from '../api/headers';
import models from '../models/index';

class ProfileRepository {
  async profiles() {
    const endpoint = `${API_ACTION_PROFILES}?_listings=true&_wins=true`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) throw new Error('Fetching profiles failed');

    try {
      const result = await response.json();
      const { data, meta } = result;

      return {
        success: true,
        data: new models.Profiles(data),
        meta,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async profile(name) {
    const endpoint = `${API_ACTION_PROFILES}/${name}?_listings=true&_wins=true`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) throw new Error('Fetching profile failed');

    try {
      const { data, meta } = await response.json();

      const profileInstance = new models.Profile(
        data._count,
        data.avatar,
        data.banner,
        data.bio,
        data.email,
        data.listings,
        data.wins,
        data.name,
        data.credits
      );

      return {
        success: true,
        data: profileInstance,
        meta,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async update(name, data) {
    const payload = JSON.stringify(data);
    const endpoint = `${API_ACTION_PROFILES}/${name}`;
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: headers(),
      body: payload,
    });

    if (!response.ok) throw new Error('Update profile failed');

    try {
      const result = await response.json();
      const { data, meta } = result;
      const profileInstance = new models.Profile(
        data._count,
        data.avatar,
        data.banner,
        data.bio,
        data.email,
        data.listings,
        data.wins,
        data.name,
      );

      return {
        success: true,
        data: profileInstance,
        meta,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async listings(name, page = 1) {
    const endpoint = `${API_ACTION_PROFILES}/${name}/listings?limit=12&page=${page}&_listings=true&_wins=true`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: headers(),
    });

    if (!response.ok) throw new Error('Fetching all listings by profile failed');

    try {
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

export default new ProfileRepository();
