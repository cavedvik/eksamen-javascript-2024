//Globale variabler
export const crudUrl = "https://crudapi.co.uk/api/v1";
export const pokeapiUrl = "https://pokeapi.co/api/v2/pokemon";
export const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer wYXuv1_mywtLzDEEy4tKMUmd_dvKp5gI3QsHBtKB7mooH5LPyA",
};
let pokemonData;
const userId = localStorage.getItem("id");

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
    const detailPromises = data.results.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    await Promise.all(detailPromises);
  } catch (error) {
    console.error("Problem fetching data: ", error);
  }
};

// Funksjon for å hente detaljer for en enkelt Pokémon
export const fetchPokemonDetails = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`HTTP error at ${url}! Status: ${response.status}`);
    const pokemonData = await response.json();
    pokemonItem(pokemonData, document.getElementById("pokeApi"));
  } catch (error) {
    console.error(`Problem fetching details for pokemon at ${url}: `, error);
  }
};

//lagrer favoritter i crud
export const addFavoriteCrud = async (pokemon) => {
  const userId = localStorage.getItem("id");

  if (!userId) {
    alert("Please log in to add favorites.");
    return;
  }

  try {
    const response = await fetch(`${crudUrl}/pokemons`, {
      method: "POST",
      headers,
      body: JSON.stringify([
        {
          userId: userId,
          name: pokemon.name,
          sprites: pokemon.sprites,
          types: pokemon.types,
          id: pokemon.id,
        },
      ]),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const responseData = await response.json();
    updateFavoritesCount();
    return response;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    alert("Failed to add to favorites.");
  }
};

// Funksjon som sletter
export const deleteFavoriteCrud = async (pokemon) => {
  try {
    const response = await fetch(pokemon._self_link, {
      method: "DELETE",
      headers,
    });
    updateFavoritesCount();
    emptyFavorite();
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
};

// viser antall favoritter i favorites-linken
export const updateFavoritesCount = async () => {
  const userId = localStorage.getItem("id");
  if (!userId) {
    console.log(
      "No username found in localStorage. User might not be logged in."
    );
    return;
  }
  try {
    const response = await fetch(`${crudUrl}/pokemons`, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const favoritesCounter = data.items.filter(
      (item) => item.userId === userId
    );
    const favoriteLink = document.getElementById("favoriteCount");
    if (!favoriteLink) {
      console.error("Element 'favoritesCount' not found in the document.");
      return;
    }
    if (favoritesCounter.length > 0) {
      favoriteLink.innerText = `(${favoritesCounter.length}) Favorites`
    } else {
      favoriteLink.innerText = "Favorites";
    }
    
    console.log("Favorites count updated to:", favoritesCounter.length);
    console.log(response);
  } catch (error) {
    console.error("Error updating favorites count", error);
  }
};

export const emptyFavorite = () => {
  const userId = localStorage.getItem("id");
  const favoriteDiv = document.getElementById("pokeFavorite");
  favoriteDiv.innerHTML = "";

  const messageP = document.createElement("p");
  const button = document.createElement("button");
  button.textContent = "Add some favorites";
  button.style.cssText = "padding: 10px; margin-top: 10px;";
  
  if (!userId) {
    messageP.textContent = "You need to be logged in to see your favorites.";
    messageP.setAttribute("id", "messageLogin");
    button.textContent = "Log in";
    button.addEventListener("click", () => {
      window.location.href = "login.html";
    });
    favoriteDiv.appendChild(messageP);
    favoriteDiv.appendChild(button);
  } else {
    messageP.textContent = "You don't have any favorites yet!";
    messageP.setAttribute("id", "messageEmpty");
    button.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    favoriteDiv.appendChild(messageP);
    favoriteDiv.appendChild(button);
  }

};

export const fetchUsernamePassword = async () => {
  try {
    const response = await fetch(`${crudUrl}/register`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching username:", error);
    return [];
  }
};

export const pokemonItem = (data, pokemonDiv) => {
  const pokemonContainer = document.createElement("div");
  pokemonContainer.style.cssText = `
        background-color: white;
        position: relative;
        cursor: pointer;
        border-radius: 10px;
        width: 250px;
        padding: 20px;
        margin: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);`;
  pokemonContainer.addEventListener("click", () => {
    window.location.href = `info.html?id=${data.id}`;
  });

  const pokemonId = document.createElement("p");
  pokemonId.textContent = "#" + `${data.id}`.padStart(4, "0"); //les mer om padStart.
  pokemonContainer.appendChild(pokemonId);

  if (data.sprites?.other["official-artwork"].front_default) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `width: 200px; height: 200px;`;
    imageElement.src = data.sprites.other["official-artwork"].front_default;
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = data.name;
  pokemonContainer.appendChild(nameElement);

  const typesElement = document.createElement("p");
  data.types.forEach((types) => {
    const typeSpan = document.createElement("span");
    const color = pokemonColors[types.type.name] || "#ffffff";
    typeSpan.textContent = `${types.type.name} `;
    typeSpan.style.cssText = `background-color: ${color}; color: #000000; padding: 0 15px; border-radius: 2px; margin-right: 5px;`;
    typesElement.appendChild(typeSpan);
  });

  pokemonContainer.appendChild(typesElement);

  if (data._uuid) {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.style.cssText = `position: absolute; top: 10px; right: 10px;`;
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation(); //chat gpt hjelp
      deleteFavoriteCrud(data);
      pokemonContainer.remove();
    });
    pokemonContainer.appendChild(deleteBtn);
  }

  pokemonDiv.appendChild(pokemonContainer);
};

//logger bruker ut og sletter fra localStorage
export const logOutUser = () => {
  const logOut = document.getElementById("logIn");
  const username = localStorage.getItem("username");
  if (username) {
    logOut.textContent = `${username} Log Out`;
    logOut.addEventListener("click", (event) => {
      localStorage.clear();
      window.location.reload();
    });
  }
};

export const visibleProfileLink = () => {
  if (userId) {
    document.getElementById("profile").style.display = "block";
  } else {
    document.getElementById("profile").style.display = "none";
  }
};
