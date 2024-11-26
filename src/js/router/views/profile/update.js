import { authGuard } from '../../../utilities/authGuard';
authGuard();
import controllers from '../../../controllers/index';
import { renderProfileData } from '.';

const form = document.forms.updateProfile;

async function init() {
    const user = controllers.AuthController.authUser;
    const { data } = await controllers.ProfileController.profile(user.name);
    
    hideEditButton();

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

function hideEditButton(){

    const editProfileButton = document.getElementById('editProfile');
    // Set the path where the edit button should be hidden
    const pathToHideButton = '/profile/edit/'; // replace with your target path

    // Check if the current path matches the specified path
    if (window.location.pathname === pathToHideButton && editProfileButton) {
        editProfileButton.style.display = 'none';
    }

}

init();