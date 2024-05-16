import {
  pokemonItem,
  headers,
  crudUrl,
  logOutUser,
  updateFavoritesCount,
  emptyFavorite,
  visibleProfileLink,
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
    sortPokemonByName(items, sortOrder);
    displayFavorites(items);
  } catch (error) {
    console.error("Error fetching favorites", error);
  }
};

export const displayFavorites = async (favorites) => {
  const favoriteDiv = document.getElementById("pokeFavorite");
  const sortOrderSelect = document.getElementById("sortOrder");
  const deleteAllButton = document.getElementById("deleteAll");

  if (!favoriteDiv) {
    console.error("Failed to find 'pokeFavorite' element.");
    return;
  }
  favoriteDiv.innerHTML = "";
  if (favorites.length > 0) {
    favorites.forEach((data) => {
      try {
        pokemonItem(data, favoriteDiv);
      } catch (error) {
        console.error("Error processing favorite item", error);
      }
      sortOrderSelect.style.display = "block";
      deleteAllButton.style.display = "block";
    });
  } else {
    emptyFavorite();
    sortOrderSelect.style.display = "none";
    deleteAllButton.style.display = "none";
  }
  await updateFavoritesCount();
};

const sortPokemonByName = (pokemonArray, sortOrder) => {
  return pokemonArray.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "desc") {
      return b.name.localeCompare(a.name);
    }
  });
};

document.getElementById("sortOrder").addEventListener("change", (event) => {
  pokeFavorites(event.target.value);
});

//chat gpt hjelp
const deleteAllFavorites = async () => {
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

    const userFavorites = favoritePokemons.items.filter(
      (item) => item.userId === userId
    );

    const deleteRequests = userFavorites.map(async (pokemon) => {
      const deleteResponse = await fetch(
        `${crudUrl}/pokemons/${pokemon._uuid}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );
      if (!deleteResponse.ok) {
        console.error(`Failed to delete pokemon with ID ${pokemon._id}`);
      }
    });

    await Promise.all(deleteRequests);

    emptyFavorite();
    updateFavoritesCount();
    window.location.reload();
  } catch (error) {
    console.error("Error deleting all favorites:", error);
  }
};

document.getElementById("deleteAll").addEventListener("click", () => {
  deleteAllFavorites();
});

document.addEventListener("DOMContentLoaded", function () {
  logOutUser();
  pokeFavorites("asc");
  visibleProfileLink();
});
