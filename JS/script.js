//Globale variabler
const baseURL = "https://crudapi.co.uk/api/v1/pokemons";
const pokeapiUrl = "https://pokeapi.co/api/v2/pokemon?limit=20";
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer wYXuv1_mywtLzDEEy4tKMUmd_dvKp5gI3QsHBtKB7mooH5LPyA",
};
const pokemonColors = {
  bug: "#A8B91A",
  dark: "#706056",
  dragon: "#6F45FC",
  electric: "#F8E02C",
  fairy: "#D695AD",
  fighting: "#D22F28",
  fire: "#EF8330",
  flying: "#B9A0F3",
  ghost: "#846797",
  grass: "#82D74C",
  ground: "#E3C065",
  ice: "#A6E9E6",
  normal: "#B8B77A",
  poison: "#B34EB1",
  psychic: "#FA6597",
  rock: "#C7B136",
  steel: "#C7C7DF",
  water: "#6490F1",
};

//fetcher pokemons
const pokeFetch = async () => {
  try {
    const response = await fetch(pokeapiUrl);
    if (!response.ok) {
      throw new Error("Error" + response.status);
    }
    const data = await response.json();
    console.log(data.results);
    randomizer(data.results);
    data.results.forEach((pokemon) => {
      fetchPokemonDetails(pokemon.url);
    });
  } catch (error) {
    console.error("There is a problem fetching the data", error);
  }
};

const fetchPokemonDetails = async (pokemonUrl) => {
  try {
    const response = await fetch(pokemonUrl);
    if (!response.ok) {
      throw new Error("error, status = " + response.status);
    }
    const pokemonData = await response.json();
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();
    pokemonItem(pokemonData, speciesData);
    console.log(speciesData);
  } catch (error) {
    console.error("there is a problem fetching the Pokemon details", error);
  }
};

//lagrer favoritter i crud
const addFavouriteCrud = async (pokemon) => {
  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify([pokemon]),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    console.log("Added to CRUD API", responseData);
    return responseData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

//lager pokemon kortet
const pokemonItem = (pokemonData, speciesData) => {
  const pokemonDiv = document.getElementById("pokeApi");
  const pokemonContainer = document.createElement("div");
  const typeColor = pokemonColors[pokemonData.types[0].type.name] || "#ffffff"; //chat-gpt hjelp

  pokemonContainer.style.cssText = `
      background-color: ${typeColor};
      border-radius: 10px;
      width: 200px;
      padding: 10px;
      margin: 10px;
      `;

  if (pokemonData.sprites?.front_default) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `width: 100px; height: 100px;`;
    imageElement.src =
      pokemonData.sprites.other["official-artwork"].front_shiny;
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = pokemonData.name;
  pokemonContainer.appendChild(nameElement);

  const typesElement = document.createElement("p");
  typesElement.textContent = `${pokemonData.types
    .map((t) => t.type.name)
    .join(", ")}`;
  pokemonContainer.appendChild(typesElement);

  const infoBtn = document.createElement("button");
  infoBtn.innerText = "Info";
  pokemonContainer.appendChild(infoBtn);

  const addToFavorite = document.createElement("button");
  addToFavorite.innerText = "Add to Favorite";
  addToFavorite.id = "addToFavorite";
  pokemonContainer.appendChild(addToFavorite);

  pokemonDiv.appendChild(pokemonContainer);

  addToFavorite.addEventListener("click", async () => {
    try {
      const addedPokemon = await addFavouriteCrud(pokemonData);
      console.log("Pokemon added to favorites:", addedPokemon);
    } catch (error) {
      console.error("Error adding Pokemon to favorites:", error);
    }
  });
};

const randomizer = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

pokeFetch();
