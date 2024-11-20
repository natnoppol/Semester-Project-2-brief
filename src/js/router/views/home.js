import { authGuard } from "../../utilities/authGuard";
import utils from "../../utilities/utils";
authGuard();

import controllers from "../../controllers/index";
// import InfiniteScroll from '../../utilities/infiniteScroll';

async function init() {
  utils.humberger()
  
    const container = document.querySelector(".main-content");
    // clearContent(container);
  
    // const infiniteScroll = new InfiniteScroll({
    //   container: container,
    //   threshold: 200,
    //   onLoad: async () => {
    //     try {
    //       if (infiniteScroll.nextPage <= infiniteScroll.totalPages) {
    //         const { data, meta } = await fetchPosts(infiniteScroll.nextPage);
    //         await renderPosts(data, container);
  
    //         // Update pagination
    //         infiniteScroll.currentPage = meta.currentPage;
    //         infiniteScroll.totalPages = meta.pageCount;
    //         infiniteScroll.nextPage = meta.nextPage;
    //       }
    //     } catch (error) {
    //       console.error('Error loading more posts:', error);
    //       container.innerHTML +=
    //         '<p>Error loading more posts. Please try again later.</p>';
    //     }
    //   },
    // });

    // Load the first page of posts initially
  const { data, meta } = await fetchListings(1);
  console.log(data)
  renderListings(data, container);
 

//   // Set initial pagination details
//   infiniteScroll.currentPage = meta.currentPage;
//   infiniteScroll.totalPages = meta.pageCount;
//   infiniteScroll.nextPage = meta.nextPage;
}
// function clearContent(target) {
//   if (target) target.innerHTML = "";
// }

async function fetchListings(page = 1) {
  const { data, meta } = await controllers.ListingsController.Listings(page);
  return { data: data.listings, meta };
}

export async function renderListings(listings, target) {
  if (target) {
    const listingsElement = listings.map((listing) => {
      const createdDate = utils.date(listing.created);
      const tags = utils.formatTags(listing.tags);

      const listingElement = document.createElement("div");
      listingElement.setAttribute(
        'class',
        'p-4 bg-white rounded shadow-md mx-auto mb-2 w-full max-w-[616px] w-full'
      );

      
      const mediaMarkup = getMediaMarkup(listing)
      const bid = getCurrentBid(listing);


      listingElement.innerHTML = `
  <div class="p-4 max-w-xl w-full">
    <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
      <div>${mediaMarkup}</div>
      <div class="flex items-center mb-3">
        <div class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
          <a class="" href="/profile/?seller=${listing.seller.name}">
            <img class="" src="${
              listing.seller.avatar.url
            }" alt="${listing.seller.avatar.alt} width="32" height="32" />
          </a>
        </div>
   
        <div>
          <div>
            <a href="/profile/?seller=
            ${listing.seller.name}">
            <h2 class="text-white dark:text-white text-lg font-medium hover:text-blue-600">${listing.seller.name}</h2>
            </a>
          </div>
          <div>
            <h2 class="text-white dark:text-white text-lg font-medium">${createdDate}</h2>
          </div>
        </div>

      </div>
      <div class="flex flex-col justify-between flex-grow gap-1">
        <a href="/listing/?id=${listing.id}">
          <h2 class="leading-relaxed text-xl text-white dark:text-gray-300 hover:text-blue-600 inline-flex items-center break-all">
          ${listing.title}
          </h2>
        </a>
        <div class="leading-relaxed text-base text-white dark:text-gray-300">
        ${tags}
        </div>
        <a class="mt-3 text-black dark:text-white hover:text-blue-600 inline-flex items-center" href="/listing/?id=${listing.id}#comments">
          <div class="flex items-center gap-1">
                    <ion-icon class="icon-comment" name="chatbubble-outline"></ion-icon>
                    ${
                      listing._count.comments === 0
                        ? "Add Comment"
                        : listing._count.comments > 1
                          ? ` ${listing._count.comments} comments`
                          : `${listing._count.comments} comment`
                    }
          </div>
        </a>
        <div class="bids-section">
          <h3 class="text-lg font-medium">Current Bids</h3>
          ${bid}
        </div>
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
          <span class="font-bold">${latestBidder}</span>: $${highestBid.amount}
        </li>
      </ul>
    `;
  }
  return ` 
    <ul>
      <li>
        <span class="font-bold">Haven't anyone bid yet</span>
      </li>
    </ul>`; // If no bids
}

function getMediaMarkup(listing){
  return listing.media[0] ? `
          <div class="flex items-center mb-3">
            <div class="w-full h-auto mr-3 inline-flex items-center justify-center flex-shrink-0">
                <a class="" href="/listing/?id=${listing.id}">
                        <img class="w-full max-h-96 object-cover" 
                        src="${listing.media[0].url || ''}" 
                        alt="${listing.media[0].alt || ''}" />
                </a>
            </div>
          </div>
          `
        : ''; // Join the array into a single string
}

init();


