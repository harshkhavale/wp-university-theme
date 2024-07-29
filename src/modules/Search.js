import axios from "axios";

class Search {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.addSearchHtml();
      this.resultsDiv = document.querySelector("#search-overlay__results");
      this.openButton = document.querySelector(".js-search-trigger");
      this.closeButton = document.querySelector(".search-overlay__close");
      this.searchOverlay = document.querySelector(".search-overlay");
      this.body = document.getElementsByTagName("body")[0]; // Get the first body element
      this.searchField = document.querySelector(".search-term");
      this.isOverlayOpen = false;
      this.isSpinnerVisible = false;
      this.typingTimer;
      this.previousValue = "";
      this.events();
    });
  }

  events() {
    this.openButton.addEventListener("click", () => {
      this.openOverlay();
    });
    this.closeButton.addEventListener("click", () => {
      this.closeOverlay();
    });
    document.addEventListener("keydown", (e) => this.keyPressDispatcher(e));
    this.searchField.addEventListener("input", () => this.typingLogic()); // Changed to 'input' event
  }

  typingLogic() {
    if (this.searchField.value !== this.previousValue) {
      clearTimeout(this.typingTimer);
      if (this.searchField.value) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>';
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(() => this.getResults(), 2000);
      } else {
        this.resultsDiv.innerHTML = "";
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.value;
  }

  async getResults() {
    try {
      const [postsResponse, pagesResponse] = await Promise.all([
        axios.get(`${universityData.root_url}/wp-json/wp/v2/posts?search=${this.searchField.value}`),
        axios.get(`${universityData.root_url}/wp-json/wp/v2/pages?search=${this.searchField.value}`)
      ]);
  
      console.log("Posts Response:", postsResponse);
      console.log("Pages Response:", pagesResponse);
  
      const combinedResults = [
        ...postsResponse.data,
        ...pagesResponse.data
      ];
  
      console.log("Combined Results:", combinedResults);
  
      let htmlContent = "";
  
      if (combinedResults.length === 0) {
        htmlContent = "<h2 class='search-overlay__section-title'>Nothing to show!</h2>";
      } else {
        htmlContent = "<h2 class='search-overlay__section-title'>General Information</h2>";
        htmlContent += combinedResults
          .map(
            (item) => `
            <ul class='link-list min-list'>
              <li><a href='${item.link}'>${item.title.rendered}</a></li>
            </ul>`
          )
          .join("");
      }
  
      this.resultsDiv.innerHTML = htmlContent;
    } catch (error) {
      console.error("Error fetching results:", error);
      this.resultsDiv.innerHTML = "<p>Sorry, something went wrong. Please try again.</p>";
    } finally {
      this.isSpinnerVisible = false;
    }
  }
  

  keyPressDispatcher(e) {
    if (e.keyCode === 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
    if (
      e.keyCode === 83 &&
      !this.isOverlayOpen &&
      document.activeElement.tagName !== "INPUT" &&
      document.activeElement.tagName !== "TEXTAREA"
    ) {
      // 'S' key
      this.openOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.classList.add("search-overlay--active");
    this.body.classList.add("body-no-scroll");
    setTimeout(() => {
      this.searchField.focus();
    }, 301);
    this.isOverlayOpen = true;
    this.searchField.focus();
  }

  closeOverlay() {
    this.searchOverlay.classList.remove("search-overlay--active");
    this.body.classList.remove("body-no-scroll");
    this.searchField.value = "";
    this.isOverlayOpen = false;
  }

  addSearchHtml() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" autocomplete="off" class="search-term" placeholder="What are you looking for?">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>
      </div>
    `
    );
  }
}

export default Search;
