import { authGuard } from "../../../utilities/authGuard";
authGuard();

import utils from "../../../utilities/utils";
import controllers from "../../../controllers/index";
import { renderListings } from "../home";

import InfiniteScroll from "../../../utilities/infiniteScroll";

const id = utils.getUrlParams("id");

async function init() {
  const loadingIndicator = document.getElementById("loading-indicator");
  loadingIndicator.classList.remove("hidden");

  utils.humberger();

  const user = getUser();
  const profile = await fetchProfile(user);
  const articleContainer = document.querySelector(".articles-list");

  const infiniteScroll = new InfiniteScroll({
    container: articleContainer,
    threshold: 200,
    onLoad: async () => {
      try {
        loadingIndicator.classList.remove("hidden"); // Show loading indicator

        const currentRenderedCount = articleContainer.children.length;
        const { data, meta } = await fetchSellerListings(
          user,
          infiniteScroll.nextPage
        );
        const { listings } = data;

        // Stop loading if all items are rendered
        if (currentRenderedCount >= meta.totalItems) {
          infiniteScroll.isLastPage = true;
          return;
        }

        await renderListings(listings, articleContainer, utils.isProfilePage());
        infiniteScroll.currentPage = meta.currentPage;
        infiniteScroll.totalPages = meta.pageCount;
        infiniteScroll.nextPage = meta.nextPage;

        if (articleContainer.children.length >= meta.totalItems) {
          infiniteScroll.isLastPage = true;
        }
      } catch (error) {
        console.error("Error loading more listings:", error);
        articleContainer.innerHTML +=
          "<p>Error loading more listings. Please try again later.</p>";
        infiniteScroll.isLastPage = true;
      } finally {
        loadingIndicator.classList.add("hidden");
      }
    },
  });
  try {
    const { data, meta } = await fetchSellerListings(user, 1);
    renderProfileData(profile);
    attachProfileEditEvent();
    renderListingsData(data.listings);

    // Initialize pagination state
    infiniteScroll.currentPage = meta.currentPage;
    infiniteScroll.totalPages = meta.pageCount;
    infiniteScroll.nextPage = meta.nextPage;
    infiniteScroll.isLastPage = meta.isLastPage;
  } catch (error) {
    console.error("Error loading initial listings:", error);
    container.innerHTML =
      "<p>Error loading listings. Please try again later.</p>";
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

async function fetchProfile(user) {
  const { data, meta } = await controllers.ProfileController.profile(user);
  return data;
}

export function renderProfileData(profile) {
  const profileContainer = document.querySelector(".profile-layout");
  renderProfile(profile, profileContainer);

  initializeToggleListings();
}

function renderProfile(profile, target) {
  renderOverlay(target);
  setProfileBanner(target, profile?.banner?.url);

  const profileElement = `
      <header class="w-full mt-2 z-10 my-8">
        <div class="flex justify-center relative">
          <span>
            <img class="h-32 w-32 rounded-full block" src="${profile.avatar?.url}" alt="${profile.avatar?.alt}" width="128" height="128"/>
          </span>
        </div>
        <div class="flex w-full gap-4 absolute right-4 -top-0 justify-end">
          ${
            isUser()
              ? `<button id="editProfile" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 z-10" type="button">Edit Profile</button>`
               : ''
            }
        </div>
        <div class="flex justify-center flex-col">
          <div class="my-4 flex justify-center">
            <h1 class="text-4xl font-bold leading-tight text-white">${profile?.name}</h1>
          </div>
          <p class="mb-4 max-w-xl flex justify-center mx-auto space-y-8 text-white">${profile.bio}</p>
          <p class="mb-4 max-w-xl flex justify-center mx-auto space-y-8 text-white">Credits: ${profile.credits}</p>
        </div>
      </header>
    `;
  target.innerHTML += profileElement;
}

// Initialize toggle functionality
function initializeToggleListings() {
  const toggleButton = document.getElementById("toggleListings");
  const listingsContainer = document.querySelector(".articles-list");

  // Initial state: hidden
  let isVisible = true;

  toggleButton.addEventListener("click", () => {
    isVisible = !isVisible; // Toggle state
    listingsContainer.classList.toggle("hidden", !isVisible); // Toggle 'hidden' class
    toggleButton.textContent = isVisible ? "Hide Listings" : "Show Listings"; // Update button text
  });
}

function renderOverlay(target) {
  const overlay = document.createElement("div");
  overlay.classList.add("profile-overlay");
  target.appendChild(overlay);
}

function getUser() {
  if (isUser()) {
    const { name } = controllers.AuthController.authUser;
    return name;
  }
  return utils.getUrlParams("seller");
}

function isUser() {
  const author = utils.getUrlParams("seller");
  return !author; // Return true if there is no author in URL, meaning user is authenticated
}


function setProfileBanner(target, background) {
  target.style.backgroundImage = `url(${background})`;
}

function attachProfileEditEvent() {
  const editProfileButton = document.querySelector("#editProfile");
  if (editProfileButton) {
    editProfileButton.addEventListener("click", () => {
      utils.redirectTo("/profile/edit/");
    });
  }
}
async function fetchSellerListings(user, page = 1) {
  const { success, data, meta } = await controllers.ProfileController.listings(
    user,
    page
  );
  //this return will not give seller data
  return { data, meta };
}

function renderListingsData(listings) {
  const articleContainer = document.querySelector(".articles-list");

  renderListings(listings, articleContainer, utils.isProfilePage());
}

function adjustContentHeight() {
  const footer = document.querySelector("footer");
  const header = document.querySelector("nav");
  const main = document.querySelector("main");

  const viewportHeight = window.innerHeight;
  const headerHeight = header.offsetHeight;
  const footerHeight = footer.offsetHeight;

  // Set the main content height to fill the remaining space
  main.style.minHeight = `${viewportHeight - headerHeight - footerHeight}px`;
}

// Adjust height on page load and resize
window.addEventListener("load", adjustContentHeight);
window.addEventListener("resize", adjustContentHeight);


init();
