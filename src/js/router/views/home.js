import utils from "../../utilities/utils";

import controllers from "../../controllers/index";
import InfiniteScroll from '../../utilities/infiniteScroll';

async function init() {
  utils.humberger()
  
    const container = document.querySelector(".main-content");
    clearContent(container);
  
    const infiniteScroll = new InfiniteScroll({
      container: container,
      threshold: 200,
      onLoad: async () => {
        try {
          if (infiniteScroll.nextPage <= infiniteScroll.totalPages) {
            const { data, meta } = await fetchListings(infiniteScroll.nextPage);
            await renderListings(data, container, utils.isProfilePage());
  
            // Update pagination
            infiniteScroll.currentPage = meta.currentPage;
            infiniteScroll.totalPages = meta.pageCount;
            infiniteScroll.nextPage = meta.nextPage;
          }
        } catch (error) {
          console.error('Error loading more listings:', error);
          container.innerHTML +=
            '<p>Error loading more listings. Please try again later.</p>';
        }
      },
    });

    // Load the first page of listings initially
  const { data, meta } = await fetchListings(1);
  renderListings(data, container, utils.isProfilePage());
  console.log(utils.isProfilePage())
 
  // Set initial pagination details
  infiniteScroll.currentPage = meta.currentPage;
  infiniteScroll.totalPages = meta.pageCount;
  infiniteScroll.nextPage = meta.nextPage;
}

function clearContent(target) {
  if (target) target.innerHTML = "";
}

async function fetchListings(page = 1) {
  const { data, meta } = await controllers.ListingsController.Listings(page);
  return { data: data.listings, meta };
}

export async function renderListings(listings, target, isProfilePage) {
  if (target) {
    const listingsElement = listings.map((listing) => {
      const createdDate = utils.date(listing.created);
      const createEndAt = utils.date(listing.endsAt);
      const tags = utils.formatTags(listing.tags);

      const listingElement = document.createElement("div");
      listingElement.setAttribute(
        'class',
        'flex justify-center rounded mx-auto mb-2 w-full max-w-[616px] w-full'
      );

    
      const mediaHeader = getMediaHeader(listing, isProfilePage);
      const bid = getCurrentBid(listing);
      const sellerDetails = isSellerActive(listing.seller)
  ? `
     <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full  flex-shrink-0">
       <a class="" href="/profile/?seller=${listing.seller.name}">
         <img class="" src="${listing.seller.avatar?.url || ''}" alt="${listing.seller.avatar?.alt || ''}" width="32" height="32" />
       </a>
     </div>
     <div>
       <div>
         <a href="/profile/?seller=${encodeURIComponent(listing.seller.name)}">
           <h2 class=" dark:text-red-700 text-lg font-bold hover:text-blue-600">${listing.seller.name}</h2>
         </a>
       </div>
       <div>
         <h2 class=" dark:text-red-700 text-lg font-bold">${createdDate}</h2>
       </div>
     </div>`
  : '';
  listingElement.innerHTML = `
    <div class="p-4 max-w-xl w-full">
      <div class="flex rounded-lg h-full p-8 flex-col shadow-2xl">
        <div>${mediaHeader}</div>
        <div class="flex items-center mb-3">${sellerDetails}</div>
        <div class="flex flex-col justify-between flex-grow gap-1">
          <a href="/listing/?id=${listing.id}">
            <h2 class="leading-relaxed text-xl text-black hover:text-blue-600 inline-flex items-center break-all">
              ${listing.title}
            </h2>
          </a>
          <div class="leading-relaxed text-base text-black hover:text-blue-600">
            ${tags}
          </div>
        </a>
      </div>
      <div class="bids-section ">
        <h3 class="text-xl dark:text-red-700 font-semibold">End at: ${createEndAt}</h3>
        <div class="dark:text-red-700 text-2xl font-bold">${bid}</div>
      </div>
      </div>
    </div>
      `;
      return listingElement;
    });

    listingsElement.forEach((element) => target.appendChild(element));
  }
}

// Get the current highest bid for a listing
function getCurrentBid(listing) {
  if (listing.bids.length > 0) {
    // Find the highest bid and the latest bidder
    let highestBid = listing.bids[0];
    let latestBidder = listing.bids[0].bidder.name;

    listing.bids.forEach((currentBid) => {
      if (currentBid.amount > highestBid.amount) {
        highestBid = currentBid; // Update highest bid
      }
      // Check if this bid is the latest one
      if (new Date(currentBid.created) > new Date(highestBid.created)) {
        highestBid = currentBid; // Update to the latest bid
        latestBidder = currentBid.bidder.name; // Update latest bidder's name
      }
    });

    // Return the HTML for displaying the highest bid and the latest bidder
    return `
      <ul>
        <li>
          <span class="">${latestBidder}: $${highestBid.amount}</span>
        </li>
      </ul>
    `;
  }
  return ` 
    <ul>
      <li>
        <span class="">Haven't anyone bid yet</span>
      </li>
    </ul>`; // If no bids
}

function getMediaHeader(listing, isProfilePage){
  // If the page is not a profile page, handle media
  if (!isProfilePage) {
    const hasMedia = Array.isArray(listing.media) && listing.media.length > 0;
    const mediaUrl = hasMedia ? listing.media[0].url : '/images/istockphoto-1396814518-612x612.jpg';
    const altText = hasMedia ? listing.media[0].alt || 'Listing image' : 'Placeholder image';

    return `
      <div class="flex items-center mb-3">
        <div
          class="w-full h-auto mr-3 inline-flex items-center justify-center shrink-0"
        >
          <a class="" href="/listing/?id=${listing.id}">
            <img
              class="img-400"
              src="${mediaUrl}"
              alt="${altText}"
            />
          </a>
        </div>
      </div>`;
  }

  // If it is a profile page, return an empty string
  return '';
}

function isSellerActive(seller) {
  return seller && seller.name ? true : false;
}

init();


