import repositories from '../repositories/index';

class ListingsService {
  constructor() {
    this.ListingsService = repositories.ListingsRepository;
  }
  async create(data) {
    if (!data.title || !data.endsAt) {
      throw new Error('The title and endsAt are required to create a listing');
    }
    return await this.ListingsService.create(data);
  }

  async listing(id) {
    return await this.ListingsService.listing(id);
  }
  
  async listings(page = 1) {
    return await this.ListingsService.listings(page);
  }

  async bid(id, bidAmount) {
    return await this.ListingsService.bid(id, bidAmount);
  }

  async update(id, data) {
    if (!data.title || !data.description) {
      throw new Error(
        'The title and description are required to update a listing'
      );
    }
    return await this.ListingsService.update(id, data);
  }

  async delete(id) {
    return await this.ListingsService.delete(id);
  }
}

export default new ListingsService();
