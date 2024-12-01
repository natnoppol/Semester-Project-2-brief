class InfiniteScroll {
    constructor({ container, threshold = 200, onLoad }) {
      this.container = container;
      this.threshold = threshold;
      this.onLoad = onLoad;
      this.currentPage = null;
      this.totalPages = null;
      this.nextPage = null;
      this.isLastPage = false;
      this.loading = false;
      this.delay = false; // To track the delay state
  
      // window.addEventListener('scroll', this.handleScroll.bind(this));
      window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 300));
    }
  
    // Debounce function to limit calls to handleScroll
    debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }
    
    async handleScroll() {
      if (this.isLastPage || this.nextPage === null || this.loading) return;
  
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - this.threshold
      ) {
        this.loading = true; // Set loading to true to prevent repeated calls
        this.delay = true; // Disable further scroll events

     

        setTimeout(async () => {
          await this.onLoad(); // Call the onLoad function after the delay
          this.delay = false; // Re-enable scrolling after the delay
          this.loading = false; // Reset loading after load is complete

    
        }, 5000); // 5-second delay
      }
    }
  }
  export default InfiniteScroll;