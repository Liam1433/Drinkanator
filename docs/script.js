const generateBtn = document.getElementById("generateBtn");
const resultDiv = document.getElementById("result");

generateBtn.addEventListener("click", async () => {
  const ingredient = document.getElementById("ingredient").value.trim().toLowerCase();
  
  if (!ingredient) {
    resultDiv.innerText = "Please enter an ingredient.";
    return;
  }
  
  try {
    const drinks = await searchCocktailsByIngredient(ingredient);
    if (drinks.length > 0) {
      const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
      const drinkDetails = await getCocktailDetails(randomDrink.idDrink);
      renderCocktail(randomDrink, drinkDetails);
    } else {
      resultDiv.innerText = "No cocktails found with that ingredient.";
    }
  } catch (error) {
    resultDiv.innerText = "There was no cocktail found with this ingredient. Please try another.";
  }
});

async function searchCocktailsByIngredient(ingredient) {
  const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.drinks || [];
}

async function getCocktailDetails(drinkId) {
  const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.drinks[0];
}

function renderCocktail(drink, drinkDetails) {
  const drinkName = drink.strDrink;
  const drinkImage = drink.strDrinkThumb;
  const ingredients = getIngredientsList(drinkDetails);
  resultDiv.innerHTML = `
    <p>Here's Something you can try!</p>
    <h2>${drinkName}</h2>
    <img src="${drinkImage}" alt="${drinkName}">
    <h3>Ingredients:</h3>
    <ul>${ingredients}</ul>
  `;
}

function getIngredientsList(drinkDetails) {
  let ingredients = "";
  for (let i = 1; i <= 15; i++) {
    const ingredient = drinkDetails[`strIngredient${i}`];
    const measurement = drinkDetails[`strMeasure${i}`];
    if (ingredient && measurement) {
      ingredients += `<li>${measurement} ${ingredient}</li>`;
    } else if (ingredient) {
      ingredients += `<li>${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredients;
}