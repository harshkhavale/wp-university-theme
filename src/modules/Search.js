class Search {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.resultsDiv = document.querySelector("#search-overlay__results");
      this.openButton = document.querySelector(".js-search-trigger");
      this.closeButton = document.querySelector(".search-overlay__close");
      this.searchOverlay = document.querySelector(".search-overlay");
      this.body = document.getElementsByTagName("body")[0]; // Get the first body element
      this.searchField = document.querySelector(".search-term");
      this.isOverlayOpen = false;
      this.isSpinnerVisible = false;
      this.typingTimer;
      this.previousValue;
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
    this.searchField.addEventListener("keydown", () => this.typingLogic());
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
    this.previousValue = this.searchField.value; // Update previousValue
  }

  getResults() {
    this.resultsDiv.innerHTML = "your text";
    this.isSpinnerVisible = false;
  }

  keyPressDispatcher(e) {
    if (e.keyCode === 27 && this.isOverlayOpen) {
      // Escape key
      this.closeOverlay();
    }
    if (e.keyCode === 83 && !this.isOverlayOpen && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      // 'S' key
      this.openOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.classList.add("search-overlay--active");
    this.body.classList.add("body-no-scroll");
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.classList.remove("search-overlay--active");
    this.body.classList.remove("body-no-scroll");
    this.isOverlayOpen = false;
  }
}

export default Search;
