import { authGuard } from '../../../utilities/authGuard';
authGuard();
import controllers from '../../../controllers/index';


const form = document.forms.updateProfile;

async function init() {
    const user = controllers.AuthController.authUser;
    const { data } = await controllers.ProfileController.profile(user.name);
    console.log(data)


    populateProfileData(data);
    attachUpdateEvent(user.name);
    attachCancelEvent();
}

function populateProfileData(profile) {
  form.bio.value = profile.bio;
  form.banner.value = profile.banner?.url || '';
  form.bannerAlt.value = profile.banner?.alt || '';
  form.avatar.value = profile.avatar?.url || '';
  form.avatarAlt.value = profile.avatar?.alt || '';

  // Set the background image for profile banner
  const profileBanner = document.getElementById('profile_banner');
  if (profileBanner) {
    profileBanner.style.backgroundImage = profile.banner?.url
      ? `url('${profile.banner.url}')`
      : "none";
  }

  // Set the background image for profile avatar
  const profileAvatar = document.getElementById('profile_avatar');
  if (profileAvatar) {
    profileAvatar.style.backgroundImage = profile.avatar?.url
      ? `url('${profile.avatar.url}')`
      : "none";
  }
}

function attachUpdateEvent(name) {
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      controllers.ProfileController.onUpdateProfile(event, name);
    });
  }
}

function attachCancelEvent() {
  const cancelButton = document.getElementById('cancelAction');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      controllers.ProfileController.onCancelProfileUpdate();
    });
  }
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