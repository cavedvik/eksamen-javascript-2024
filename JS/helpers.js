//Globale variabler
export const crudUrl = "https://crudapi.co.uk/api/v1/pokemons";
const pokeapiUrl = "https://pokeapi.co/api/v2/pokemon?limit=50";
export const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer wYXuv1_mywtLzDEEy4tKMUmd_dvKp5gI3QsHBtKB7mooH5LPyA",
};

//hentet farger bassert på type her: "https://gist.github.com/apaleslimghost/0d25ec801ca4fc43317bcff298af43c3"
export const pokemonColors = {
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
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      // Håndter hvert fetch av detaljer parallelt
      const detailPromises = data.results.map(pokemon => fetchPokemonDetails(pokemon.url));
      await Promise.all(detailPromises);
  } catch (error) {
      console.error("Problem fetching data: ", error);
  }
};

// Funksjon for å hente detaljer for en enkelt Pokémon
export const fetchPokemonDetails = async (url) => {
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error at ${url}! Status: ${response.status}`);
      const pokemonData = await response.json();
      pokemonItem(pokemonData, document.getElementById("pokeApi"));
  } catch (error) {
      console.error(`Problem fetching details for pokemon at ${url}: `, error);
  }
};

//lagrer favoritter i crud
export const addFavouriteCrud = async (pokemon) => {
  try {
    const response = await fetch(crudUrl, {
      method: "POST",
      headers,
      body: JSON.stringify([{
        name: pokemon.name,
        sprites: pokemon.sprites,
        types: pokemon.types,
        id: pokemon.id,
    }]),
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

export const pokemonItem = (data, pokemonDiv) => {
  const pokemonContainer = document.createElement("div");
  pokemonContainer.style.cssText = `
        background-color: white;
        border-radius: 10px;
        width: 200px;
        padding: 10px;
        margin: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);`;

  const pokemonId = document.createElement("p");
  pokemonId.textContent = `#000${data.id}`;
  pokemonContainer.appendChild(pokemonId);

  if (data.sprites?.other["official-artwork"].front_default) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `width: 100px; height: 100px;`;
    imageElement.src = data.sprites.other["official-artwork"].front_default;
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = data.name;
  pokemonContainer.appendChild(nameElement);

  const typesElement = document.createElement("p");
  data.types.forEach(type => {
    const typeSpan = document.createElement("span");
    const color = pokemonColors[type.type.name] || "#ffffff";
    typeSpan.textContent = `${type.type.name} `;
    typeSpan.style.cssText = `background-color: ${color}; color: #000000; padding: 0 15px; border-radius: 2px; margin-right: 5px;`;
    typesElement.appendChild(typeSpan);
  });

  pokemonContainer.appendChild(typesElement);

  // Sjekk om _uuid er tilgjengelig og bestem knappen basert på det
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

