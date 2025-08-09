import View from './view.js';
import icons from 'url:../../img/icons.svg'; // parcel2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);

      const btnGoToPage = +btn.dataset.goto;
      console.log(btnGoToPage);

      handler(btnGoToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const curPage = this._data.page;

    // page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
          <button data-goto=${
            curPage + 1
          } class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // last page
    if (this._data.page === numPages && numPages > 1) {
      return `
          <button data-goto=${
            curPage - 1
          } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
      `;
    }

    // other page
    if (this._data.page < numPages) {
      return `
          <button data-goto=${
            curPage - 1
          } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>
          <button data-goto=${
            curPage + 1
          } class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // page 1, and there are NO other pages
    return ' ';
  }
}

export default new PaginationView();
