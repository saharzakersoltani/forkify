import { API_URL, RESULTS_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

// =================== state =====================
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmark: [],
};

//==================== load recipe ====================
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    let { recipe } = data.data;
    state.recipe = {
      cookingTime: recipe.cooking_time,
      id: recipe.id,
      image: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      title: recipe.title,
    };
    console.log(recipe);
    state.search.page = 1;

    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

//================= load search result ================
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
      };
    });
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

//=================== get search results page ===================
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

//=================== update servings ===================
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServing
  });

  state.recipe.servings = newServings;
};

//=================== add and delete bookmark ===================
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmark.push(recipe);
  // mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const deleteBookmark = function (id) {
  // delete bookmark
  const index = state.bookmark.findIndex(ind => ind.id === id);
  state.bookmark.splice(index, 1);
  // Mark current bookmark as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
