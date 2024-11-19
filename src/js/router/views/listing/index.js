import controllers from '../../../controllers/index';
import utils from '../../../utilities/utils';
// import { initComment } from './comment';
import { initializeSwiper } from '../../../../main';

async function init() {
  utils.humberger()
  const container = document.querySelector('.container');
//   clearContent(container);

  try {
    const id = utils.getUrlParams('id');
    const listings = await fetchListings(id);

    await renderListingsElement(listings, id, container);
    // await renderCommentElement(listings, id, container);

    // attachEditEvent(id);
    // attachDeleteEvent(id);
    
  } catch (error) {
    console.error('Error fetching Listings:', error);
    container.innerHTML = '<p>Error loading Listings. Please try again later.</p>';
  }
}
async function fetchListings(id) {
  const { data } = await controllers.ListingsController.listing(id);
  console.log("data of listings",data)
  return data;
}

function renderListingsElement(listings, id, target) {
  renderListings(listings, target);
//   attachEditEvent(id);
//   attachDeleteEvent(id);
}


// function clearContent(target) {
//   target.innerHTML = '';
// }

async function renderListings(listings, target) {
  const listingElement = document.createElement('article');
    listingElement.classList.add('max-w-full', 'mx-auto', 'p-4', 'w-full','sm:w-1/2', 'lg:w-2/3', 'swiper');
  
const swiperWrapper = document.createElement('div');
swiperWrapper.classList.add('swiper-wrapper');

  const SecondListingElement = document.createElement('div');

  SecondListingElement.classList.add('max-w-full','mx-auto', 'p-4', 'w-full','sm:w-1/2', 'lg:w-2/3');

  const listingCreated = utils.date(listings.created);
  const tags = utils.formatTags(listings.tags);


  const mediaSlides = listings.media?.map(mediaItem => {
    return `
     <div class="swiper-slide">
        <img class="article__cover__image w-full h-auto object-cover md:rounded-lg" 
          src="${mediaItem.url ? mediaItem.url : ''}" 
          style="aspect-ratio: auto 1000/420;" 
          width="1000" height="420" 
          alt="${mediaItem.alt ? mediaItem.alt : ''}" />
    </div>
    `;
  }).join('') || '';  // Join the array into a single string

  swiperWrapper.innerHTML = mediaSlides;
  listingElement.appendChild(swiperWrapper);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination');
  const navigationPrev = document.createElement('div');
  navigationPrev.classList.add('swiper-button-prev');
  const navigationNext = document.createElement('div');
  navigationNext.classList.add('swiper-button-next');
  const scrollbar = document.createElement('div');
  scrollbar.classList.add('swiper-scrollbar');

  listingElement.appendChild(pagination);
  listingElement.appendChild(navigationPrev);
  listingElement.appendChild(navigationNext);
  listingElement.appendChild(scrollbar);



  SecondListingElement.innerHTML= `
    <div class="p-4 max-w-full mx-auto break-all">
      <div class="flex rounded-lg h-full dark:bg-gray-800 bg-teal-400 p-8 flex-col">
        <div class="flex items-center mb-3">
          <div class="w-20 h-20 mr-4 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
             <a class="" href="/profile/?seller=${listings.seller.name}">
              <img class="" src="${
              listings.seller.avatar.url
              }" alt="${listings.seller.avatar.alt} width="32" height="32" />
            </a>
          </div>
            <div class="">
              <div>
                <div>
                  <a href="/profile/?seller=${listings.seller.name}">
                    <h2 class="text-white dark:text-white text-lg   font-medium hover:text-blue-600">
                      ${listings.seller.name}
                    </h2>
                  </a>
                </div>
                <div>
                  <h2 class="text-white dark:text-white text-lg font-medium">listed on: ${listingCreated}</h2>
                </div>
              </div>             

              <div class="flex flex-col justify-between flex-grow">
                <h2 class="leading-relaxed text-xl text-white dark:text-gray-300 ">
                  ${listings.title}
                </h2>
      
                <div class="leading-relaxed text-base text-white dark:text-gray-300">
                  ${tags}
                </div>

                <div>
                  <div id="article-body" class="leading-relaxed text-xl text-white dark:text-gray-300 ">
                  ${listings.description}
                </div>
              </div>
              <div class=" flex gap-4 ">
                  ${
                  isSeller(listings.seller.name)
                  ? `<button class="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" id="editlistings">Edit listings</button>
                  <button class="w-full text-white btn-danger-cancel hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" id="deletePost">Delete Post</button>`
                  : ''
                  }
              </div>
            </div>
          </div>
        </div> 
      </div>   
    </div>     
  
  `
 
  target.appendChild(listingElement);
  target.appendChild(SecondListingElement);

  initializeSwiper()
}

// function attachEditEvent(id) {
//   const editButton = document.getElementById('editPost');
//   if (editButton) {
//     editButton.addEventListener('click', () => {
//       utils.redirectTo(`/post/edit/?id=${id}`);
//     });
//   }
// }

// function attachDeleteEvent(id) {
//   const deleteButton = document.getElementById('deletePost');
//   if (deleteButton) {
//     deleteButton.addEventListener('click', async () => {
//       const confirmed = window.confirm(
//         'Are you sure you want to delete this post?'
//       );
//       if (confirmed) {
//         controllers.PostController.onDeletePost(id);
//       } else {
//         console.log('Delete action canceled');
//       }
//     });
//   }
// }

function isSeller(seller) {
  const authUser = controllers.AuthController.authUser;
  if (authUser.name === seller) return true;
  return false;
}

// function renderCommentElement(post, id, target) {
//   renderCommentInput(post.author, target);
//   submitCommentHandler(id);
//   const commentContainer = createCommentContainer();
//   initComment(post.comments, commentContainer);
// }

// function renderCommentInput(user, target) {
//   const commentElement = document.createElement('section');
//   commentElement.id = 'comments';
//   commentElement.setAttribute('class', 'flex flex-col max-w-screen-md mx-auto');

//   commentElement.innerHTML = `
//     <div id="comment-container" class="max-w-xl">
//       <form name="comment" id="new_comment" class="flex">
//         <span class=" mr-2 shrink-0">
//           <img class="h-8 w-8 rounded-full" src="${user.avatar.url}" alt="${user.avatar.alt}" width="32" height="32" loading="lazy">
//         </span>
//         <div class="comment-form__inner">
//           <div class="comment-form__field" data-tracking-name="comment_form_textfield">
//             <textarea placeholder="Add to the discussion" (event)" id="text-area" class="crayons-textfield comment-textarea textfield--ghost" aria-label="Add a comment to the discussion" name="comment" rows="3" cols="50"></textarea>
//           </div>
//           <div class="my-4">
//             <button type="submit" class="flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600btn-submit-comment mr-2" data-tracking-name="comment_submit_button">Submit</button>
//           </div>
//         </div>
//       </form>
//     </div>
//   `;
//   target.appendChild(commentElement);
// }

// function submitCommentHandler(id) {
//   const form = document.forms.comment;
//   if (form) {
//     form.addEventListener('submit', (event) => {
//       event.preventDefault();
//       controllers.CommentController.onComment(event, id);
//     });
//   }
// }

// function createCommentContainer() {
//   const section = document.querySelector('section');
//   const commentContainer = document.getElementById('comments-container');
//   if (commentContainer) {
//     commentContainer = document.createElement('div');
//     commentContainer.id = 'comments-container';
//     commentContainer.setAttribute('class', 'comments flex');
//     section.appendChild(commentContainer);
//   }
//   return section;
// }




init();


