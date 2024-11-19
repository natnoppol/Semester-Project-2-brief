import './css/style.css'

import controllers from './js/controllers/index';

import router from './js/router';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


// Register the modules
Swiper.use([Navigation, Pagination]);

export function initializeSwiper() {
  new Swiper('.swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}





(async () => {
  await router(window.location.pathname);
})();


const logoutListener = new controllers.LogoutController(
    controllers.AuthController
  );

function init() {
  updateUserAvatar();
  updateUserAvatarMeta();
  onAvatarClick();

  // setupSearchListener();
}

function updateUserAvatar() {
  const userAvatar = document.querySelectorAll('.avatar-image');

  if (controllers.AuthController.authUser) {
    const { avatar } = controllers.AuthController.authUser;
    userAvatar.forEach((elem) => {
      elem.src = avatar.url;
      elem.alt = avatar.alt;
    });
  }
}

function updateUserAvatarMeta() {
  const username = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  if (username && userEmail) {
    const { name, email } = controllers.AuthController.authUser;
    username.textContent = name;
    userEmail.textContent = email;
  }
}
function onAvatarClick() {
  const userMenuButton = document.getElementById('user-menu-button');

  const userMenu = document.querySelector(
    '[aria-labelledby="user-menu-button"]'
  );
  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      userMenu.classList.toggle('hidden');
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