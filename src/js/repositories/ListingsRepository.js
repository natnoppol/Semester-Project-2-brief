import { API_ACTION_LISTING } from '../api/constant';
import { headers } from '../api/headers';
import models from '../models/index';

class ListingsRepository {
    async create(data) {
      const payload = JSON.stringify(data);
      const endpoint = `${API_ACTION_LISTING}`;
      const response = await fetch(endpoint, {
        method: 'post',
        headers: headers(),
        body: payload,
      });
    
      if (!response.ok) throw new Error('Creating list failed');
    
      try {
        const result = await response.json();
        const { data, meta } = result;
        const listInstance = new models.Listing(
          data._count,
          data.description,
          data.created,
          data.id,
          data.media,
          data.tags,
          data.title,
          data.updated,
          data.seller,
          data.bids,
          data.endsAt
        );
        console.log(data);
        return { success: true, data: listInstance, meta };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
    async listing(id) {
      const endpoint = `${API_ACTION_LISTING}/${id}?_seller=true&_bids=true`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers(),
      });
    
      if (!response.ok) throw new Error('Fetching single lists failed');
    
      try {
        const result = await response.json();
        const { data, meta } = result;
        const listInstance = new models.Listing(
          data._count,
          data.description,
          data.created,
          data.id,
          data.media,
          data.tags,
          data.title,
          data.updated,
          data.seller,
          data.bids,
          data.endsAt
        );
        return { success: true, data: listInstance, meta };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }

    async listings(page = 1) {
      const endpoint = `${API_ACTION_LISTING}?limit=12&page=${page}&_seller=true&_bids=true`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers(),
      });
  
      if (!response.ok) throw new Error('Fetching all lists failed');
  
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


  
  
    // async update(id, data) {
    //   const payload = JSON.stringify(data);
    //   const endpoint = `${API_ACTION_LISTING}/${id}`;
    //   const response = await fetch(endpoint, {
    //     method: 'PUT',
    //     headers: headers(),
    //     body: payload,
    //   });
  
    //   if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
    //   try {
    //     const result = await response.json();
    //     const { data, meta } = result;
    //     const listInstance = new models.list(
    //       data._count,
    //       data.author,
    //       data.body,
    //       data.created,
    //       data.comments,
    //       data.id,
    //       data.media,
    //       data.tags,
    //       data.title,
    //       data.updated
    //     );
    //     return { success: true, data: listInstance, meta };
    //   } catch (error) {
    //     return { success: false, message: error.message };
    //   }
    // }
  
    // async delete(id) {
    //   const endpoint = `${API_ACTION_LISTING}/${id}`;
    //   const response = await fetch(endpoint, {
    //     method: 'DELETE',
    //     headers: headers(),
    //   });
  
    //   if (response.status === 204)
    //     return { success: true, message: 'list deleted successfully.' };
    //   if (!response.ok) throw new Error(`Error: ${response.statusText}`);
  
    //   try {
    //     const result = await response.json();
    //     const { data, meta } = result;
    //     return { success: true, data: data, meta };
    //   } catch (error) {
    //     return { success: false, message: error.message };
    //   }
    // }
  }
  
  export default new ListingsRepository();
  