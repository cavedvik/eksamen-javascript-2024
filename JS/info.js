import {
  logOutUser,
  updateFavoritesCount,
  pokeapiUrl,
  pokemonColors,
  addFavoriteCrud,
  visibleProfileLink,
} from "./helpers.js";

//history pushState
//---------------henter id fra url i nettleser-----------------------------------
const urlParams = new URLSearchParams(window.location.search); //les mer om dette
let currentPokemonId = urlParams.get("id") ? parseInt(urlParams.get("id"), 10) : 1 ;


document.addEventListener("DOMContentLoaded", () => {
  fetchPokemonDetails(currentPokemonId);
});

export const fetchPokemonDetails = async (id) => {
  const url = `${pokeapiUrl}/${id}`;
  try {
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`HTTP error at ${url}! Status: ${response.status}`);
    const pokemonData = await response.json();
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
  const pokeInfoDiv = document.getElementById("pokemonInfo");
  pokeInfoDiv.innerHTML = "";
  if (!pokeInfoDiv) {
    console.error("pokeInfoContainer not found in the document.");
    return;
  }
  pokeInfoDiv.innerHTML = "";
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

  const criesElement = document.createElement("div");
  criesElement.innerHTML = `
    <p><audio controls src="${pokemonData.cries.latest}">Your browser does not support the audio element.</audio></p>   
  `;
  pokeInfo.appendChild(criesElement);

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


  const typesElement = document.createElement("p");
  pokemonData.types.forEach((type) => {
    const typeSpan = document.createElement("span");
    const color = pokemonColors[type.type.name] || "#ffffff";
    typeSpan.textContent = type.type.name;
    typeSpan.style.cssText = `
    background-color: ${color};`;
    typesElement.appendChild(typeSpan);
  });
  pokeInfo.appendChild(typesElement)

  const addToFavorite = document.createElement("button");
  addToFavorite.textContent = "Add to favorite";
  addToFavorite.addEventListener("click", async () => {
    const addedPokemon = await addFavoriteCrud(pokemonData);
    console.log("Pokemon added to favorites:", addedPokemon);
  });
  pokeInfo.appendChild(addToFavorite);

  pokeInfoDiv.appendChild(pokeInfo);
};
document.getElementById("backBtn").addEventListener("click", () => {
  window.history.back();
});

document.getElementById("nextPokemonBtn").addEventListener("click", () => {
  currentPokemonId++;
  fetchPokemonDetails(currentPokemonId);
});

document.getElementById("previousBtn").addEventListener("click", () => {
  if (currentPokemonId > 1) {
    currentPokemonId--;
    fetchPokemonDetails(currentPokemonId);
  }
});

logOutUser();
updateFavoritesCount();
visibleProfileLink()
