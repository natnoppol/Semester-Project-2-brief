
const utils = {
    redirectTo: (path) => {
      if (typeof path !== 'string') throw new Error('path must be a string');
      window.location.href = path;
    },
  
    getUrlParams: (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    },
  

    formatTags: (tags) => {
    if (typeof tags === 'string') {
      tags = [tags]; // Wrap the string in an array
    }
    if (!tags || tags.length === 0) return '';
    return tags
      .map(
        (tag) =>
          `<a href="/tags/?tag=${encodeURIComponent(
            tag
          )}" class="text-lg font-semibold hover:text-blue-600">#${tag}</a>`
      ) // Add '#' before each tag
      .join(' '); // Join tags with a space
  },
  humberger: (() => {
    // Define the toggle function
    const toggleMenu = () => {
      const menuIcon = document.getElementById("menuIcon");
      const closeIcon = document.getElementById("closeIcon");
      const mobileMenu = document.getElementById("mobile-menu");
  
      if (!menuIcon || !closeIcon || !mobileMenu) {
        console.error("Menu elements not found. Ensure the IDs are correct.");
        return;
      }
  
      console.log("Menu button clicked");
      menuIcon.classList.toggle("hidden"); // Toggle 'hamburger' icon
      closeIcon.classList.toggle("hidden"); // Toggle 'close' icon
      mobileMenu.classList.toggle("hidden"); // Toggle mobile menu visibility
    };
  
    return () => {
      const menuButton = document.getElementById("menuButton");
  
      if (!menuButton) {
        console.error("Menu button not found. Ensure the ID is correct.");
        return;
      }
  
      // Ensure only one event listener is attached
      menuButton.removeEventListener("click", toggleMenu);
      menuButton.addEventListener("click", toggleMenu);
  
      // Handle HMR cleanup (for development environments like Vite)
      if (import.meta.hot) {
        import.meta.hot.dispose(() => {
          menuButton.removeEventListener("click", toggleMenu);
        });
      }
    };
  })(),
    
    date: (dateString) => {
        const date = new Date(dateString);
      const today = new Date();
  
      // Custom mapping for 3-letter month abbreviations
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
  
      const day = date.getDate();
      const month = monthNames[date.getMonth()]; // Get the 3-letter month abbreviation
  
      let formattedDate = `${month} ${day}`;
  
      // Add the year only if it's not the current year
      if (date.getFullYear() !== today.getFullYear()) {
        formattedDate += ` ${date.getFullYear()}`;
      }
  
      return formattedDate;
    },
  
    time: (date) => {
      const now = new Date();
      const createdTime = new Date(date);
      const secondsAgo = Math.floor((now - createdTime) / 1000);
  
      let interval = Math.floor(secondsAgo / 31536000); // years
      if (interval > 1) return `${interval} years ago`;
      if (interval === 1) return '1 year ago';
  
      interval = Math.floor(secondsAgo / 2592000); // months
      if (interval > 1) return `${interval} months ago`;
      if (interval === 1) return '1 month ago';
  
      interval = Math.floor(secondsAgo / 86400); // days
      if (interval > 1) return `${interval} days ago`;
      if (interval === 1) return '1 day ago';
  
      interval = Math.floor(secondsAgo / 3600); // hours
      if (interval > 1) return `${interval} hours ago`;
      if (interval === 1) return '1 hour ago';
  
      interval = Math.floor(secondsAgo / 60); // minutes
      if (interval > 1) return `${interval} minutes ago`;
      if (interval === 1) return '1 minute ago';
  
      return secondsAgo > 1 ? `${secondsAgo} seconds ago` : 'now';
    },
  
    isProfilePage: () => {
      return window.location.pathname.includes('/profile');
    }
};
  
  export default utils;