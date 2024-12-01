import { authGuard } from '../../../utilities/authGuard';

import controllers from '../../../controllers/index';
import utils from '../../../utilities/utils';

import { initializeSwiper } from '../../../../main';
import { list } from 'postcss';

async function init() {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.classList.remove("hidden");

  utils.humberger()
  const container = document.querySelector('.container');
  clearContent(container);

  try {
    await authGuard();

    const id = utils.getUrlParams('id');
    const listings = await fetchListings(id);

    renderListingsElement(listings, id, container);

    attachBidEvent(id)
  } catch (error) {
    console.error('Error fetching Listings:', error);
    container.innerHTML = '<p>Error loading Listings. Please try again later.</p>';
  }finally {
      loadingIndicator.classList.add('hidden');
    }
}
async function fetchListings(id) {
  const { data } = await controllers.ListingsController.listing(id);
  return data;
}

function renderListingsElement(listings, id, target) {
  renderListings(listings, target);
  
  attachEditEvent(id);
  attachDeleteEvent(id);
}


function clearContent(target) {
  target.innerHTML = '';
}

async function renderListings(listings, target) {
  const listingElement = document.createElement('article');
    listingElement.classList.add('max-w-full', 'mx-auto', 'p-4', 'w-full','sm', 'lg:w-2/3', 'swiper');
  
const swiperWrapper = document.createElement('div');
swiperWrapper.classList.add('swiper-wrapper');

  const SecondListingElement = document.createElement('div');

  SecondListingElement.classList.add('max-w-full','mx-auto', 'p-4', 'w-full','sm', 'lg:w-2/3');

  const listingCreated = utils.date(listings.created);
  const tags = utils.formatTags(listings.tags);


  const mediaSlides = listings.media?.map(mediaItem => {
    return `
     <div class="swiper-slide h-5 dark:bg-gray-800 items-center rounded-lg">
        <img class="w-full max-h-96 object-contain" 
          src="${mediaItem.url ? mediaItem.url : ''}" 
          alt="${mediaItem.alt ? mediaItem.alt : ''}" />
    </div>
    `;
  }).join('') || '';  // Join the array into a single string

  swiperWrapper.innerHTML = mediaSlides;
  listingElement.appendChild(swiperWrapper);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination');
  const navigationPrev = document.createElement('div');
  navigationPrev.classList.add('swiper-button-prev');
  const navigationNext = document.createElement('div');
  navigationNext.classList.add('swiper-button-next');
  const scrollbar = document.createElement('div');
  scrollbar.classList.add('swiper-scrollbar');

  listingElement.appendChild(pagination);
  listingElement.appendChild(navigationPrev);
  listingElement.appendChild(navigationNext);
  listingElement.appendChild(scrollbar);



  SecondListingElement.innerHTML= `
    <div class="p-4 max-w-full mx-auto break-all">
      <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
        <div class="flex items-center mb-3">
          <div class="w-20 h-20 mr-4 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
             <a class="" href="/profile/?seller=${listings.seller.name}">
              <img class="" src="${
              listings.seller.avatar.url
              }" alt="${listings.seller.avatar.alt} width="32" height="32" />
            </a>
          </div>
            <div class="">
              <div>
                <div>
                  <a href="/profile/?seller=${listings.seller.name}">
                    <h2 class="text-white dark:text-white text-lg   font-medium hover:text-blue-600">
                      ${listings.seller.name}
                    </h2>
                  </a>
                </div>
                <div>
                  <h2 class="text-white dark:text-white text-lg font-medium">Listed on: ${listingCreated}</h2>
                </div>
              </div>             

              <div class="flex flex-col justify-between flex-grow">
                <h2 class="leading-relaxed text-2xl font-bold text-white dark:text-gray-300 uppercase">
                  ${listings.title}
                </h2>
      
                <div class="leading-relaxed text-base text-white dark:text-gray-300">
                  ${tags}
                </div>

                <div>
                  <div id="article-body" class="text-lg font-bold text-white dark:text-gray-300">Description:
                  ${listings.description}
                </div>
              </div>
              
              <div class="bidding-section mt-6 space-y-4 ">
                <form class="bid-form " data-listing-id="LISTING_ID" id="bid" name="bid">
                  <label for="bidAmount" class="leading-relaxed text-lg font-bold text-white dark:text-gray-300">Place Your Bid:</label>
                  <input
                    type="number"
                    id="bidAmount"
                    name="bidAmount"
                    placeholder="Enter your bid amount"
                    class="mx-auto mt-1 border rounded px-3 py-2"
                    min="1"
                    required
                  />
                  <button
    
                    type="submit"
                    class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Bid
                  </button>
                </form>
                <div class=" flex gap-4 ">
                  ${
                  isSeller(listings.seller.name)
                  ? `<button class="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" id="editListing">Update</button>
                  <button class="w-full text-white btn-danger-cancel bg-red-400 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" id="deleteListing">Delete</button>`
                  : ''
                  }
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>   
    </div>     
  
  `
 
  target.appendChild(listingElement);
  target.appendChild(SecondListingElement);

  initializeSwiper()
}
function isSeller(seller) {
  const authUser = controllers.AuthController.authUser;
  if (authUser.name === seller) return true;
  return false;
}


function attachBidEvent(id) {
  const form = document.forms.bid;
  
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      controllers.ListingsController.onBid(event, id);
    });
  }
}
function attachEditEvent(id) {
  const editButton = document.getElementById('editListing');
  if (editButton) {
    editButton.addEventListener('click', () => {
      utils.redirectTo(`/listing/edit/?id=${id}`);
    });
  }
}

function attachDeleteEvent(id) {
  const deleteButton = document.getElementById('deleteListing');
  if (deleteButton) {
    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this listing?'
      );
      if (confirmed) {
        controllers.ListingsController.onDeleteListing(id);
      } else {
        console.log('Delete action canceled');
      }
    });
  }
}





init();


