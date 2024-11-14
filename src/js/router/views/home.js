import { authGuard } from "../../utilities/authGuard";
authGuard();

// import controllers from "../../controllers/index";
// import utils from "../../utilities/utils";
// import InfiniteScroll from '../../utilities/infiniteScroll';

async function init() {
    const menuButton = document.getElementById("menuButton");
    const menuIcon = document.getElementById("menuIcon");
    const closeIcon = document.getElementById("closeIcon");
    const mobileMenu = document.getElementById("mobile-menu");
  
    menuButton.addEventListener("click", () => {
      menuIcon.classList.toggle("hidden"); // Toggle 'hamburger' icon
      closeIcon.classList.toggle("hidden"); // Toggle 'close' icon
      mobileMenu.classList.toggle("hidden");// Toggle mobile menu visibility
    });
  
    // const container = document.querySelector(".main-content");
    // clearContent(container);
  
    // const infiniteScroll = new InfiniteScroll({
    //   container: container,
    //   threshold: 200,
    //   onLoad: async () => {
    //     try {
    //       if (infiniteScroll.nextPage <= infiniteScroll.totalPages) {
    //         const { data, meta } = await fetchPosts(infiniteScroll.nextPage);
    //         await renderPosts(data, container);
  
    //         // Update pagination
    //         infiniteScroll.currentPage = meta.currentPage;
    //         infiniteScroll.totalPages = meta.pageCount;
    //         infiniteScroll.nextPage = meta.nextPage;
    //       }
    //     } catch (error) {
    //       console.error('Error loading more posts:', error);
    //       container.innerHTML +=
    //         '<p>Error loading more posts. Please try again later.</p>';
    //     }
    //   },
    // });

//     // Load the first page of posts initially
//   const { data, meta } = await fetchPosts(1);
//   renderPosts(data, container);

//   // Set initial pagination details
//   infiniteScroll.currentPage = meta.currentPage;
//   infiniteScroll.totalPages = meta.pageCount;
//   infiniteScroll.nextPage = meta.nextPage;
}

init()
  