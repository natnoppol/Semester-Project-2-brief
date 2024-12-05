import { authGuard } from '../../../utilities/authGuard';
authGuard();
import controllers from '../../../controllers/index';
import utils from '../../../utilities/utils';

const form = document.forms.createListing;
const id = utils.getUrlParams('id');

function init() {
  utils.humberger()

  updateDateAttributes();

  attachCreateEvent();
  attachCancelEvent(event);
}

function attachCreateEvent() {
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const dateInput = document.getElementById("endsAt");
      const selectedDate = new Date(dateInput.value);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);
      oneYearFromNow.setHours(0, 0, 0, 0);

      if (selectedDate.getTime() < today.getTime() || selectedDate.getTime() > oneYearFromNow.getTime()) {
          alert("Please select a date between today and one year from now.");
          return;
      }

      controllers.ListingsController.onCreateListing(event);
    });
  }
}

function attachCancelEvent() {
  const cancelButton = document.getElementById('cancelAction');
  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      controllers.ListingsController.onCancelListing(id);
    });
  }
}

function updateDateAttributes() {
  const dateInput = document.getElementById("endsAt");
  const today = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  const minDate = today.toLocaleDateString('en-CA');
  const maxDate = oneYearFromNow.toLocaleDateString('en-CA');

  dateInput.setAttribute("min", minDate);
  dateInput.setAttribute("max", maxDate);
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