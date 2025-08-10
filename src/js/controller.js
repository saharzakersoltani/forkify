import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
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
    resultsView.update(model.getSearchResultsPage());

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
  }
};

//=============== control search results ================
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResult(query);

    // 3) Render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

//=============== control pagination ================
const controlPagination = function (btnGoToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(btnGoToPage));

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
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
};

//============== add handler render ===============
const init = function () {
  RecipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
