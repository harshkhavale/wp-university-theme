import axios from "axios";

class Search {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.addSearchHtml();
      this.resultsDiv = document.querySelector("#search-overlay__results");
      this.openButton = document.querySelector(".js-search-trigger");
      this.closeButton = document.querySelector(".search-overlay__close");
      this.searchOverlay = document.querySelector(".search-overlay");
      this.body = document.getElementsByTagName("body")[0];
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
    this.searchField.addEventListener("input", () => this.typingLogic());
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
      // UPDATED:
      const results = await axios.get(
        `${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`
      );
      console.log(results);
      this.resultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class='search-overlay__section-title'>General Information</h2>
            ${
              results.data.generalInfo.length
                ? `<ul class='link-list min-list'>` +
                  results.data.generalInfo
                    .map(
                      (item) => `
                        <li><a href='${item.permalink}'>${item.title}</a> ${
                          item.postType == "post" ? "by " + item.authorName : ""
                        }</li>
                      `
                    )
                    .join("") +
                  `</ul>`
                : "<p>Nothing to show here..</p>"
            }
          </div>
          <div class="one-third">
            <h2 class='search-overlay__section-title'>Programs</h2>
            ${
              results.data.programs.length
                ? `<ul class='link-list min-list'>` +
                  results.data.programs
                    .map(
                      (item) => `
                        <li><a href='${item.permalink}'>${item.title}</a></li>
                      `
                    )
                    .join("") +
                  `</ul>`
                : `<p>Nothing to show here..<a href='${universityData.root_url}/programs'>View all</a></p>`
            }
            <h2 class='search-overlay__section-title'>Professors</h2>
            ${
              results.data.professors.length
                ? `<ul class='professor-cards'>` +
                  results.data.professors
                    .map(
                      (item) => `
                          <li class="professor-card__list-item"><a class="professor-card" href="${item.permalink} ?>">
                        <img class="professor-card__image" src="                        ${item.image}
" alt="">
                        <span class="professor-card">
                    ${item.title}
                        </span>
                    </a></li>
                      `
                    )
                    .join("") +
                  `</ul>`
                : "<p>Nothing to show here..</p>"
            }
          </div>
          <div class="one-third">
           
            <h2 class='search-overlay__section-title'>Events</h2>
            ${
              results.data.events.length
                ? `<ul class='link-list min-list'>` +
                  results.data.events
                    .map(
                      (item) => `
                      <div class="event-summary">
    <a class="event-summary__date t-center" href="${item.permalink}">

        
        <span class="event-summary__month">${item.month}</span>
        <span class="event-summary__day">${item.day}</span>
    </a>
    <div class="event-summary__content">
        <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
        ${item.description}
            <a href="${item.permalink}" class="nu gray">Read more</a>
        </p>
    </div>
</div>
                      `
                    )
                    .join("") +
                  `</ul>`
                : `<p>Nothing to show here..<a href='${universityData.root_url}/events'>View all</a></p>`
            }
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching results:", error);
      this.resultsDiv.innerHTML =
        "<p>Sorry, something went wrong. Please try again.</p>";
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
    return false;
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
