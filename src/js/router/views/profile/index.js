import { authGuard } from '../../../utilities/authGuard';
authGuard();
import utils from '../../../utilities/utils';
import controllers from '../../../controllers/index';
// import { renderPosts } from '../home';
// import InfiniteScroll from '../../../utilities/infiniteScroll';

async function init() {
  utils.humberger()


  const user = getUser();
  const profile = await fetchProfile(user);
  const articleContainer = document.querySelector('.articles-list');

//   const infiniteScroll = new InfiniteScroll({
//     container: articleContainer,
//     threshold: 200,
//     onLoad: async () => {
//       try {
//         const currentRenderedCount = articleContainer.children.length;
//         const { data, meta } = await fetchAuthorPosts(
//           author,
//           infiniteScroll.nextPage
//         );
//         const { posts } = data;

//         // Stop loading if all items are rendered
//         if (currentRenderedCount >= meta.totalItems) {
//           infiniteScroll.isLastPage = true;
//           return;
//         }

//         await renderPosts(posts, articleContainer);
//         infiniteScroll.currentPage = meta.currentPage;
//         infiniteScroll.totalPages = meta.pageCount;
//         infiniteScroll.nextPage = meta.nextPage;

//         if (articleContainer.children.length >= meta.totalItems) {
//           infiniteScroll.isLastPage = true;
//         }
//       } catch (error) {
//         console.error('Error loading more posts:', error);
//         articleContainer.innerHTML +=
//           '<p>Error loading more posts. Please try again later.</p>';
//         infiniteScroll.isLastPage = true;
//       }
//     },
//   });

  // const { data, meta } = await fetchSellerListings(user, 1);
  renderProfileData(profile);
  attachProfileEditEvent();
  // renderListingsData(data.listings);

//   await setupFollowButton(profile.name);

//   // Initialize pagination state
//   infiniteScroll.currentPage = meta.currentPage;
//   infiniteScroll.totalPages = meta.pageCount;
//   infiniteScroll.nextPage = meta.nextPage;
//   infiniteScroll.isLastPage = meta.isLastPage;
}

async function fetchProfile(user) {
    const { data, meta } = await controllers.ProfileController.profile(user);
    return data;
}

export function renderProfileData(profile) {
  const profileContainer = document.querySelector('.profile-layout');
  renderProfile(profile, profileContainer);
}

function renderProfile(profile, target) {
    renderOverlay(target);
    setProfileBanner(target, profile.banner?.url);
  
    const profileElement = `
      <header id="headerWithEditProfile" class="w-full mt-2 z-10 my-8">
        <div class="flex justify-center relative">
          <span>
            <img class="h-32 w-32 rounded-full block" src="${
              profile.avatar?.url
            }" alt="${profile.avatar?.alt}" width="128" height="128"/>
          </span>
          
        </div>
        <div class="flex justify-center flex-col">
          <div class="my-4 flex justify-center">
            <h1 class="text-4xl font-bold leading-tight text-white">${profile?.name}</h1>
          </div>
          <p class="mb-4 max-w-xl flex justify-center mx-auto space-y-8 text-white">${
            profile.bio
          }</p>
          <p class="mb-4 max-w-xl flex justify-center mx-auto space-y-8 text-white">Credits: ${
            profile.credits
          }</p>
        </div>
      </header>
    `;
    target.innerHTML += profileElement;
  }

function renderOverlay(target) {
    const overlay = document.createElement('div');
    overlay.classList.add('profile-overlay');
    target.appendChild(overlay);
}


function getUser() {
    if (isUser()) {
      const { name } = controllers.AuthController.authUser;
      return name;
    }
    return utils.getUrlParams('seller');
  }

function isUser() {
    const author = utils.getUrlParams('seller');
    return !author; // Return true if there is no author in URL, meaning user is authenticated
  }

function setProfileBanner(target, background) {
    target.style.backgroundImage = `url(${background})`;
}

function attachProfileEditEvent() {
    const editProfileButton = document.querySelector('#editProfile');
    if (editProfileButton) {
      editProfileButton.addEventListener('click', () => {
        utils.redirectTo('/profile/edit/');
      });
    }
  }
  async function fetchSellerListings(user, page = 1) {
    const { success, data, meta } = await controllers.ProfileController.listings(
      user,
      page
    );
    return { data, meta };
  }


function renderListingsData(listings) {
  const articleContainer = document.querySelector('.articles-list');
  renderPosts(posts, articleContainer);
}


init();
