export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(
      // 'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886'
      `https://forkify-api.jonas.io/api/v2/recipes/${id}`
    );
    if (!res.ok) throw new Error(`some thing happened! (${res.status})`);

    const data = await res.json();

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
  } catch (err) {
    console.error(err.message);
  }
};
