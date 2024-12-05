import './css/style.css';

import controllers from './js/controllers/index';

import router from './js/router';

(async () => {
  await router(window.location.pathname);
})();

const logoutListener = new controllers.LogoutController(
  controllers.AuthController
);

function init() {
  updateUserAvatar();
  updateMobileMenu();
  onAvatarClick();

  setupSearchListener();
}

function setupSearchListener() {
  const searchForm = document.querySelector('form[name="search"]');
  const searchFormMobile = document.querySelector('form[name="searchMobile"]');

  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', handleSearchSubmit);
    const searchInputMobile = document.getElementById('search-input-mobile');
    searchInput.addEventListener('keypress', handleSearchSubmit);
    searchInputMobile.addEventListener('keypress', handleSearchSubmit);
  }
}

function handleSearch(event) {
  event.preventDefault();

  const searchInput = document.getElementById('search-input');
  const query = searchInput.value.trim();
  if (query) {
    controllers.SearchController.onSearch(query);
  }
}

function handleSearchSubmit(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default form submission
    const query = event.target.value.trim();
    if (query) controllers.SearchController.onSearch(query);
  }
}

function updateUserAvatar() {
  const userAvatar = document.querySelectorAll('.avatar-image');
  const loginButton = document.getElementById('btn-login');
  const userAvatarContainer = document.getElementById('user-avatar-container');
  const authUser = controllers.AuthController.authUser;

  if (authUser) {
    const { avatar } = authUser;
    // Show avatar and hide login button
    userAvatarContainer.classList.remove('hidden');
    loginButton.classList.add('hidden');

    userAvatar.forEach((elem) => {
      elem.src = avatar.url || '/images/default-avatar.png'; // Fallback to a default avatar
      elem.alt = avatar.alt || 'User Avatar';
    });
  } else {
    // Show login button and hide avatar
    userAvatarContainer.classList.add('hidden');
    loginButton.classList.remove('hidden');

    userAvatar.forEach((elem) => {
      elem.src = '/images/online-shopping-logo.png'; // Fallback to a white image
      elem.alt = 'Default white avatar';
    });
  }
}

function updateMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const loginButton = document.getElementById('btn-login-mobile');
  const username = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');

  const otherMenuItems = mobileMenu.querySelectorAll('a, form, .field');
  const avatarImage = mobileMenu.querySelector('.avatar-image');
  const authUser = controllers.AuthController.authUser;

  if (authUser) {
    // Authenticated user: Show user details and menu, hide login button
    const { avatar, name, email } = authUser;

    if (avatarImage) {
      avatarImage.src = avatar?.url || '/images/online-shopping-logo.png'; // Fallback avatar
      avatarImage.alt = avatar?.alt || 'User Avatar';
    }

    if (username) username.textContent = name || 'Unknown User';
    if (userEmail) userEmail.textContent = email || 'No Email';

    loginButton.classList.add('hidden'); // Hide login button
    otherMenuItems.forEach((item) => item.classList.remove('hidden')); // Show menu items
    avatarImage.classList.remove('hidden');
  } else {
    // No authenticated user: Show login button only
    if (avatarImage) {
      avatarImage.src = '/images/online-shopping-logo.png'; // Fallback to a default image
      avatarImage.alt = 'Default logo page';
    }

    loginButton.classList.remove('hidden'); // Show login button
    otherMenuItems.forEach((item) => item.classList.add('hidden')); // Hide other items
    if (avatarImage) avatarImage.classList.add('hidden'); // Hide avatar
  }
}

function onAvatarClick() {
  const userMenuButton = document.getElementById('user-menu-button');
  const loginButton = document.getElementById('btn-login');
  const loginButtonMobile = document.getElementById('btn-login-mobile');
  const userMenu = document.querySelector(
    '[aria-labelledby="user-menu-button"]'
  );

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      userMenu.classList.toggle('hidden');
    });
  }
  if (loginButton) {
    loginButton.addEventListener('click', () => {});
  }

  if (loginButtonMobile) {
    loginButtonMobile.addEventListener('click', () => {
      window.location.href = '/auth/login/';
    });
  }

  // event click outside of the dropdown menu
  document.addEventListener('click', (event) => {
    if (!userMenu.contains(event.target) && event.target !== userMenuButton) {
      userMenu.classList.add('hidden');
    }
  });
}

init();
