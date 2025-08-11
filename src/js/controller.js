import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import resultsView from './views/resultsView.js';

//============================================

// if (module.hot) {
//   module.hot.accept();
// }

//============== control recipes ======================
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    ResultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmark);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
    console.error(err);
  }
};

//=============== control search results ================
const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();

    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResult(query);

    // 3) Render results
    // console.log(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//=============== control pagination ================
const controlPagination = function (btnGoToPage) {
  // 1) Render new results
  ResultsView.render(model.getSearchResultsPage(btnGoToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

//=============== control serving ================
const controlServing = function (newServing) {
  // update the recipe servings (in state)
  model.updateServings(newServing);

  // update the recipe view
  // RecipeView.render(model.state.recipe);
  RecipeView.update(model.state.recipe); // just update text and attributes in the DOM without re-render entire view
};

//=============== control bookmarks ================
const controlAddBookmarks = function () {
  // 1) Add / remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  RecipeView.update(model.state.recipe);
  console.log(model.state.recipe);
  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmark);
};

//============== control bookmarks ===============
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

//============== control add recipe ===============
const controlAddRecipe = function (newRecipe) {
  // console.log(newRecipe);
  // Upload the new recipe data
};

//============== add handler render ===============
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServing);
  RecipeView.addHandlerAddBookmark(controlAddBookmarks);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
