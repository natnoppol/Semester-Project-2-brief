import services from '../services/index';
import utils from '../utilities/utils';

class ListingsController {
  constructor() {
    this.ListingsService = services.ListingsService;
  }
  async create(data) {
    try {
      const { data: listData, meta } = await this.ListingsService.create(data);

      console.log('Create list success:', { listData });
      // Handle successful login, e.g., redirect

      utils.redirectTo(`/listing/?id=${listData.id}`);
    } catch (error) {
      console.error('Create list failed:', error);
      // Handle failed create list, e.g., show error message
    }
  }

  async onCreateListing(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.tags) data.tags = this.structuredTags(data.tags);
    if (data.media) data.media = this.structuredMedia(data);

    await this.create(data);
  }
  structuredTags(tags) {
    return tags ? tags.split(',').map((tag) => tag.trim()) : [];
  }
  structuredMedia(data) {
    const mediaArray = data.media
      ? data.media.split(',').map((url) => url.trim())
      : [];
    const altArray = data.alt
      ? data.alt.split(',').map((alt) => alt.trim())
      : [];

    return mediaArray.map((url, index) => ({
      url: url,
      alt: altArray[index] || `${index + 1}`,
    }));
  }

  onCancelListing(id = null) {
    if (!id) utils.redirectTo('/');
    if (id) utils.redirectTo(`/listing/?id=${id}`);
  }

  async listing(id) {
    try {
      const { data, meta } = await this.ListingsService.listing(id);

      return { data, meta };
    } catch (error) {
      console.error('Fetch post error:', error);
      throw new Error('Fetch single post failed.');
    }
  }

  async Listings(page = 1) {
    try {
      const { success, data, meta } = await this.ListingsService.listings(page);
      return { success, data, meta };
    } catch (error) {
      console.error('Fetch Listings error:', error);
      throw new Error('Fetch Listings failed.');
    }
  }

  async onBid(event, id) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convert form data to an object

    const { bidAmount } = data;

    try {
      const { success, data, meta } = await this.ListingsService.bid(
        id,
        bidAmount
      );

      if (success) {
        alert('Bid placed successfully:', data);
        // Optionally update UI with new bid information
      } else {
        console.error('Failed to place bid:', meta);
      }

      utils.redirectTo(`/`);
    } catch (error) {
      console.error('Error while placing bid:', error);
    }
  }

  async update(id, data) {
    try {
      const { data: listingData, meta } = await this.ListingsService.update(
        id,
        data
      );
      console.log('Create listing success:', { listingData });
      // Handle successful login, e.g., redirect
      utils.redirectTo(`/listing/?id=${listingData.id}`);
    } catch (error) {
      console.error('Update listing failed:', error);
      // Handle failed create listing, e.g., show error message
    }
  }
  async onUpdateListing(event, id) {
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.tags) data.tags = this.structuredTags(data.tags);
    if (data.media) data.media = this.structuredMedia(data);

    await this.update(id, data);
  }

  async delete(id) {
    try {
      const resposne = await this.ListingsService.delete(id);
      if (resposne.success) {
        console.log(resposne.message);
        alert(resposne.message);
        utils.redirectTo('/');
      } else {
        console.error('Failed to delete listing:', result.message);
        alert('Error deleting listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('An error occurred while deleting the listing.');
    }
  }

  async onDeleteListing(id) {
    await this.delete(id);
  }
}

export default new ListingsController();
