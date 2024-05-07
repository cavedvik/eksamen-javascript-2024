//Globale variabler
export const crudUrl = "https://crudapi.co.uk/api/v1/pokemons";
const pokeapiUrl = "https://pokeapi.co/api/v2/pokemon?limit=20";
export const headers = {
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
export const pokeFetch = async () => {
  try {
    const response = await fetch(pokeapiUrl);
    if (!response.ok) {
      throw new Error("Error" + response.status);
    }
    const data = await response.json();
    console.log(data.results);
    randomizer(data.results);

    for (const pokemon of data.results) {
      try {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) {
          throw new Error(`error, status = ${pokemonResponse.status}`);
        }
        const pokemonData = await pokemonResponse.json();

        pokemonItem(pokemonData, document.getElementById("pokeApi"), "pokeApi");
      } catch (error) {
        console.error("There is a problem fetching the Pokemon details", error);
      }
    }
  } catch (error) {
    console.error("There is a problem fetching the data", error);
  }
};

//lagrer favoritter i crud
const addFavouriteCrud = async (pokemon) => {
  try {
    const response = await fetch(crudUrl, {
      method: "POST",
      headers,
      body: JSON.stringify([pokemon]),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// Funksjon som sletter
export const deleteFavoriteCrud = async (pokemon) => {
  try {
    const response = await fetch(pokemon._self_link, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

//lager pokemon kortet
export const pokemonItem = (data, parentElement, id) => {
  const pokemonDiv = document.getElementById(id);
  const pokemonContainer = document.createElement("div");
  const typeColor =
    data.types &&
    data.types.length > 0 &&
    data.types[0].type &&
    data.types[0].type.name //chat-gpt hjelp
      ? pokemonColors[data.types[0].type.name] || "#ffffff"
      : "#ffffff";

  pokemonContainer.style.cssText = `
      background-color: ${typeColor};
      border-radius: 10px;
      width: 200px;
      padding: 10px;
      margin: 10px;
      `;

  if (data.sprites?.front_default) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `width: 100px; height: 100px;`;
    imageElement.src = data.sprites.other["official-artwork"].front_shiny;
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = data.name;
  pokemonContainer.appendChild(nameElement);

  const typesElement = document.createElement("p");
  typesElement.textContent = `${data.types.map((t) => t.type.name).join(", ")}`;
  pokemonContainer.appendChild(typesElement);

  const infoBtn = document.createElement("button");
  infoBtn.innerText = "Info";
  pokemonContainer.appendChild(infoBtn);

  //endrer sletteknapp/legg til favoritter ut i fra hvem siden man er på
  if (data._uuid) {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteFavoriteCrud(data);
      pokemonContainer.remove();
    });
    pokemonContainer.appendChild(deleteBtn);
  } else {
    const addToFavorite = document.createElement("button");
    addToFavorite.innerText = "Add to Favorite";
    addToFavorite.id = "addToFavorite";
    addToFavorite.addEventListener("click", async () => {
      try {
        const addedPokemon = await addFavouriteCrud(data);
        console.log("Pokemon added to favorites:", addedPokemon);
      } catch (error) {
        console.error("Error adding Pokemon to favorites:", error);
      }
    });
    pokemonContainer.appendChild(addToFavorite);
  }

  pokemonDiv.appendChild(pokemonContainer);
};

const randomizer = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
