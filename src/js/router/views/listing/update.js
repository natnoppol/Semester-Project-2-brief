import controllers from '../../../controllers/index';
import utils from '../../../utilities/utils';

const form = document.forms.updateListing;
const id = utils.getUrlParams('id');

async function init() {
  try {
    const listing = await controllers.ListingsController.listing(id);
    const { data } = listing;

    populateListingData(data);

    attachUpdateEvent();
    attachCancelEvent(id);
  } catch (error) {
    console.error('Error fetching listing:', error);
    container.innerHTML = '<p>Error loading listing. Please try again later.</p>';
  }
}


async function populateListingData(listing) {

    console.log(listing)
    if (Array.isArray(listing.media)) {

        const updatedMedia = listing.media.map((mediaItem, index) => ({
            ...mediaItem, // Keep existing media properties
            alt: mediaItem.alt || `Alt ${index + 1}`,
          }));

        const mediaUrls = updatedMedia.map((mediaItem) => mediaItem.url || '').join(', ');
        const mediaAlts = updatedMedia.map((mediaItem) => mediaItem.alt || '').join(', ');
        console.log(mediaAlts)
        
        form.media.value = mediaUrls;
        form.alt.value = mediaAlts;
        
    }else {
        form.media.value = ''
        form.alt.value = '' 
    }
  form.title.value = listing.title;
  form.description.value = listing.description || '';
  form.tags.value = listing.tags ? listing.tags.join(', ') : '';
  
}


function attachUpdateEvent() {
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      controllers.ListingsController.onUpdateListing(event, id);
    });
  }
}

function attachCancelEvent(id) {
  const cancelButton = document.getElementById('cancelAction');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      controllers.ListingsController.onCancelListing(id);
    });
  }
}

init();
