import {
  pokeFetch,
  logOutUser,
  updateFavoritesCount,
  visibleProfileLink,
  fetchPokemonDetails,
} from "./helpers.js";

export const pokeFetchByType = async (type) => {
  if (!type) {
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
    data.pokemon.forEach((data) => fetchPokemonDetails(data.pokemon.url));
  } catch (error) {
    console.error(`Problem fetching Pokémon by type at ${url}: `, error);
  }
};

//Type select
document
  .getElementById("pokemonTypeSelect")
  .addEventListener("change", function () {
    pokeFetchByType(this.value);
  });

  //Load more knapp
document.getElementById("loadMore").addEventListener("click", pokeFetch);

pokeFetchByType();
updateFavoritesCount();
pokeFetch();
logOutUser();
visibleProfileLink();
