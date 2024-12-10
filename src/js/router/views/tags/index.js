import controllers from '../../../controllers/index';
import utils from '../../../utilities/utils';
import { renderListings } from '../home';

import InfiniteScroll from '../../../utilities/infiniteScroll';

const tag = utils.getUrlParams('tag');
let renderTagLayout = false; // Set to `false` to disable rendering layout


async function init() {
const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.classList.remove('hidden');
  const container = document.querySelector('.container-tag');
  const showTag = document.querySelector('.show-tag');

  try {
    const infiniteScroll = new InfiniteScroll({
      container: container,
      threshold: 200,
      onLoad: async () => {
        try {
          const currentRenderedCount = container.children.length;
          const { data, meta } = await fetchTags(tag, infiniteScroll.nextPage);
         

          const { listings } = data;
          // Stop loading if all items are rendered
          if (currentRenderedCount >= meta.totalItems) {
            infiniteScroll.isLastPage = true;
            return;
          }

        // Conditionally render layout
        if (renderTagLayout) {
            const tagLayout = renderLayout(data, container);
            renderListingByTag(listings, tagLayout);
          } else {
            renderListingByTag(listings, container); // Directly render listings
          }


          infiniteScroll.currentPage = meta.currentPage;
          infiniteScroll.totalPages = meta.pageCount;
          infiniteScroll.nextPage = meta.nextPage;

          if (container.children.length >= meta.totalItems) {
            infiniteScroll.isLastPage = true;
          }
        } catch (error) {
          console.error('Error loading more listing:', error);
          container.innerHTML +=
            '<p>Error loading more listing. Please try again later.</p>';
          infiniteScroll.isLastPage = true;
        }finally {
            loadingIndicator.classList.add('hidden'); // Hide loading indicator
          }
      },
    });

    const { data, meta } = await fetchTags(tag, 1);
    const {listings}= data;

    // Conditionally render layout
    if (renderTagLayout) {
        const tagLayout = renderLayout(data, container);
        renderListingByTag(listings, tagLayout);
      } else {
        renderListingByTag(listings, container); // Directly render listings
      }

    renderHeader(showTag)
    
    // Initialize pagination state
    infiniteScroll.currentPage = meta.currentPage;
    infiniteScroll.totalPages = meta.pageCount;
    infiniteScroll.nextPage = meta.nextPage;
    infiniteScroll.isLastPage = meta.isLastPage;
  } catch (error) {
    console.error('Error fetching tags:', error);
    container.innerHTML = `<p>Error loading tag details.</p>`;
  }
}

async function fetchTags(tag, page = 1) {
  const { data, meta } = await controllers.TagsController.tags(tag, page);
  return { data, meta };
}

function renderLayout(data, target) {
  const tagElement = document.createElement('div'); 
  tagElement.setAttribute('class', ' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6');

  tagElement.innerHTML = `
    <header class="page-header w-full mx-auto max-w-2xl my-4">
      <h1 class="title text-3xl font-bold w-full max-w-2xl">#${tag}</h1>
    </header>
  `;

  // Append tagElement to the target container
  target.innerHTML = ''; // Clear existing content
  target.appendChild(tagElement);

  return tagElement;
}

function renderHeader(target) {
    const tagElement = document.createElement('div'); // Define tagElement here
    tagElement.setAttribute('class', 'w-full mx-auto max-w-2xl my-4');
  
    tagElement.innerHTML = `
      <header class="page-header w-full mx-auto max-w-2xl my-4">
        <h1 class="title text-3xl font-bold w-full max-w-2xl text-red-700">#${tag}</h1>
      </header>
    `;
  
    target.appendChild(tagElement); // Append tagElement to the target container
    return tagElement;
  }
  

function renderListingByTag(data, target) {
  if (data && data.length > 0) {
    renderListings(data, target);
  } else {
    console.warn('No listings found for this tag.');
    target.innerHTML += `<p>No listings available for this tag.</p>`;
  }
}

init();
