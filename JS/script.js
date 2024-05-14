import {
  pokeFetch,
  logOutUser,
  updateFavoritesCount,
  visibleProfileLink,
  pokeapiUrl,
  fetchPokemonDetails,
} from "./helpers.js";

export const pokeFetchByType = async (type) => {
  if (!type) {
    console.error("No type selected.");
    return;
  }

  const url = `https://pokeapi.co/api/v2/type/${type.toLowerCase()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    document.getElementById("pokeApi").innerHTML = "";
    data.pokemon.forEach((p) => fetchPokemonDetails(p.pokemon.url));
  } catch (error) {
    console.error(`Problem fetching Pokémon by type at ${url}: `, error);
  }
};

document
  .getElementById("pokemonTypeSelect")
  .addEventListener("change", function () {
    pokeFetchByType(this.value);
  });

document.getElementById("loadMore").addEventListener("click", pokeFetch);
//browser history push state
pokeFetchByType();
updateFavoritesCount();
pokeFetch();
logOutUser();
visibleProfileLink();
