import {
  logOutUser,
  updateFavoritesCount,
  pokeapiUrl,
  pokemonColors,
  addFavouriteCrud
} from "./helpers.js";

export const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`HTTP error at ${url}! Status: ${response.status}`);
    const pokemonData = await response.json();
    console.log(url);
    if (!pokemonData) {
      console.error("No data returned from the API");
      return;
    }
    pokemonInfo(pokemonData);
  } catch (error) {
    console.error(`Problem fetching details for pokemon at ${url}: `, error);
  }
};

const pokemonInfo = (pokemonData) => {

  const pokeInfoContainer = document.getElementById("pokeInfoContainer");
  if (!pokeInfoContainer) {
    console.error("pokeInfoContainer not found in the document.");
    return;
  }

  const pokeInfo = document.createElement("div");
  pokeInfo.setAttribute("id", "pokeInfo");

  const pokemonId = document.createElement("p");
  pokemonId.textContent = `#000${pokemonData.id}`;
  pokeInfo.appendChild(pokemonId);

  const pokeName = document.createElement("h2");
  pokeName.textContent = pokemonData.species.name;
  pokeInfo.appendChild(pokeName);

  if (pokemonData.sprites?.other["official-artwork"].front_default) {
    const imageElement = document.createElement("img");
    imageElement.src =
      pokemonData.sprites.other["official-artwork"].front_default;
    imageElement.style.cssText = `width: 300px; height: 300px;`;
    pokeInfo.appendChild(imageElement);
  }

  const abilitiesList = document.createElement("ul");
  pokemonData.abilities.forEach((ability) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `Ability: ${ability.ability.name}`;
    abilitiesList.appendChild(listItem);
  });
  pokeInfo.appendChild(abilitiesList);

  const pokeHeight = document.createElement("p");
  pokeHeight.textContent = `Height: ${pokemonData.height}`;
  pokeInfo.appendChild(pokeHeight);

  const pokeWeight = document.createElement("p");
  pokeWeight.textContent = `Weight: ${pokemonData.weight}`;
  pokeInfo.appendChild(pokeWeight);

  const criesElement = document.createElement("div");
  criesElement.innerHTML = `
    <p>Game sound: <audio controls src="${pokemonData.cries.latest}">Your browser does not support the audio element.</audio></p>   
  `;
  pokeInfo.appendChild(criesElement);

  const typesElement = document.createElement("p");
  pokemonData.types.forEach((type) => {
    const typeSpan = document.createElement("span");
    const color = pokemonColors[type.type.name] || "#ffffff";
    typeSpan.textContent = type.type.name;
    typeSpan.style.cssText = `
    background-color: ${color};`;
    typesElement.appendChild(typeSpan);
  });

  pokeInfoContainer.appendChild(pokeInfo);

};
const backToMain = document.getElementById("backBtn");
backToMain.addEventListener("click", () => {
  window.history.back();
})

const addToFavorite = document.getElementById("addToFavoriteBtn");
addToFavorite.addEventListener("click", async () => {
  addFavouriteCrud(addToFavorite)
})

const nextPokemonBtn = document.getElementById("nextPokemonBtn")

const previousPokemon = document.getElementById("previousBtn")








const urlParams = new URLSearchParams(window.location.search); //les mer om dette
const id = urlParams.get("id");

fetchPokemonDetails(`${pokeapiUrl}/${id}`);
logOutUser();
updateFavoritesCount();

//quarry
