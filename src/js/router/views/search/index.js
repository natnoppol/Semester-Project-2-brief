import utils from '../../../utilities/utils';
import { renderListings } from '../home';

import InfiniteScroll from '../../../utilities/infiniteScroll';

import controllers from '../../../controllers';

async function init() {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.classList.remove("hidden");

  const container = document.querySelector('#main-content');
  const containerSearch = document.getElementById('container-search')


  const query = utils.getUrlParams('q');
  containerSearch.appendChild(renderPageHeader(query)); // show result of users searching

  const articleList = renderStoryContainer(); // Call function to create article list
  container.appendChild(articleList);

  const infiniteScroll = new InfiniteScroll({
    container: articleList,
    threshold: 200,
    onLoad: async () => {
      try {
        loadingIndicator.classList.remove("hidden");

        const currentRenderedCount = articleList.children.length;
        const { data, meta } = await performSearch(query, infiniteScroll.nextPage);

        const listings = data?.listings;
        if (listings) {
          renderSearchResult(listings, articleList);

          // Stop loading if all items are rendered
          if (currentRenderedCount >= meta.totalItems) {
            infiniteScroll.isLastPage = true;
            return;
          }

          infiniteScroll.currentPage = meta.currentPage;
          infiniteScroll.totalPages = meta.pageCount;
          infiniteScroll.nextPage = meta.nextPage;

          if (articleList.children.length >= meta.totalItems) {
            infiniteScroll.isLastPage = true;
          }
        } else {
          infiniteScroll.isLastPage = true;
          if (!articleList.querySelector('.no-articles')) {
            articleList.innerHTML += '<p class="no-articles text-3xl font-bold w-full max-w-2xl">No articles found.</p>';
          }
        }
      } catch (error) {
        console.error('Error loading more listings:', error);
        articleList.innerHTML += '<p>Error loading more listings. Please try again later.</p>';
        infiniteScroll.isLastPage = true;
      }finally {
      loadingIndicator.classList.add('hidden');
    }
    },
  });

  const { data, meta } = await performSearch(query, 1);

  const listings = data?.listings;
  if (listings && listings.length > 0) {
    renderSearchResult(listings, articleList);
    infiniteScroll.currentPage = meta.currentPage;
    infiniteScroll.totalPages = meta.pageCount;
    infiniteScroll.nextPage = meta.nextPage;
  }else {
    articleList.innerHTML = '<p class="no-articles text-3xl font-bold w-full max-w-2xl">No articles found.</p>';
    }
}

function renderStoryContainer() {
  const articleList = document.createElement('div');
  articleList.id = 'article-list';
  articleList.classList.add('article-list', 'grid', 'grid-cols-1','md:grid-cols-2','lg:grid-cols-4','gap-6');
  const subStories = document.createElement('div');
  subStories.id = 'substories';
  subStories.classList.add('substories', 'search-result-loaded');

  articleList.appendChild(subStories);
  return articleList;
}

function renderPageHeader(query) {
  const header = document.createElement('div');
  header.setAttribute('class', 'page-header w-full mx-auto max-w-2xl my-4');

  // Create the title element
  const title = document.createElement('h1');
  title.setAttribute('class', 'title text-3xl font-bold w-full max-w-2xl');
  title.textContent = `Search results for: ${query}`;

  // Append the title element to the header
  header.appendChild(title);

  return header;
}

async function performSearch(query, page = 1) {
  if (query) {
    try {
      const { data, meta } = await controllers.SearchController.listings(query, page);
      return { data: data || { listings: [] }, meta: meta || {} }; // Ensure defaults
    } catch (error) {
      console.error(error);
      return { data: { listings: [] }, meta: {} }; // Return empty data on error
    }
  }
  return { data: { listings: [] }, meta: {} }; // Return empty if no query
}


function renderArticleWrapper(listings, subStories) {
  listings.forEach((listing) => {
    const article = document.createElement('article');
    article.id = `article-${listing.id}`;
    article.classList.add('story');
    article.setAttribute('data-article-path', `/listing/?id=${listing.id}`);
    article.setAttribute('data-feed-content-id', listing.id);
    subStories.appendChild(article);
  });
}

function renderSearchResult(listings, target) {
  const subStories = target.querySelector('#substories');
  if (subStories) {
    renderArticleWrapper(listings, subStories);
  }

  renderListings(listings, target);
}

init();
