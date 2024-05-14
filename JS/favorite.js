import {
  pokemonItem,
  headers,
  crudUrl,
  logOutUser,
  updateFavoritesCount,
  emptyFavorite,
  visibleProfileLink
} from "./helpers.js";

const pokeFavorites = async (sortOrder) => {
  const userId = localStorage.getItem("id");

  try {
    const response = await fetch(`${crudUrl}/pokemons`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const favoritePokemons = await response.json();
    const items = favoritePokemons.items.filter(
      (item) => item.userId === userId
    );
    console.log("Favorites fetched:", favoritePokemons.items);
    sortPokemonByName(items, sortOrder)
    displayFavorites(items);
  } catch (error) {
    console.error("Error fetching favorites", error);
  }
};

export const displayFavorites = async (favorites) => {
  const favoriteDiv = document.getElementById("pokeFavorite");

  console.log("Favorite div:", favoriteDiv);

  if (!favoriteDiv) {
    console.error("Failed to find 'pokeFavorite' element.");
    return;
  }
  favoriteDiv.innerHTML = "";
  if (favorites.length > 0) {
    favorites.forEach((data) => {
      console.log("PokemonDiv before calling pokemonItem:", favoriteDiv);
      try {
        pokemonItem(data, favoriteDiv);
        console.log("Processing favorite:", data);
      } catch (error) {
        console.error("Error processing favorite item", error);
      }
    });
  } else {
    emptyFavorite();
  }
  await updateFavoritesCount();
  console.log("Displayed favorites:", favorites);
};

const sortPokemonByName = (pokemonArray, sortOrder) => {
  return pokemonArray.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name)
    } else if (sortOrder === "desc") {
      return b.name.localeCompare(a.name)
    }
  });
};

document.getElementById("sortOrder").addEventListener("change", (event) => {
pokeFavorites(event.target.value)
})

document.addEventListener("DOMContentLoaded", function () {
  logOutUser();
  pokeFavorites("asc");
  visibleProfileLink()
});
