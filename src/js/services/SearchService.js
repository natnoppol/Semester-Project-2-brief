import repositories from "../repositories/index";

class SearchService {
  constructor() {
    this.searchRepository = repositories.SearchRepository
  }
  async listings(query, page = 1) {
    return await this.searchRepository.listings(query, page)
  }
}

export default new SearchService();