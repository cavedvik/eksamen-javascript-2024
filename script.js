const url = "https://pokeapi.co/api/v2/pokemon?limit=10";

//fetcher pokemons
const pokeFetch = async () => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error" + response.status);
    }
    const data = await response.json();
    console.log(data.results);
    randomizer(data.results)
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
    pokemonItem(pokemonData);
    console.log(pokemonData);
  } catch (error) {
    console.error("there is a problem fetching the Pokemon details", error);
  }
};

//Overskrift
const headers = document.getElementById("header");
headers.innerText = `Pokemons`;

//Pokemon kort
const pokemonItem = (pokemonData) => {
  const pokemonDiv = document.getElementById("pokeApi");
  const pokemonContainer = document.createElement("div");
  pokemonContainer.style.cssText = `
      background-color: #df314f61;
      border-radius: 10px;
      width: 300px;
      `;

  if (pokemonData.sprites?.other?.["official-artwork"]) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `
    width: 200px`
    imageElement.src = pokemonData.sprites.other["official-artwork"].front_shiny;
    imageElement.loading = "lazy"
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = pokemonData.name;
  pokemonContainer.appendChild(nameElement);

  const infoBtn = document.createElement("button");
  infoBtn.innerText = "info";

  const addToFavorite = document.createElement("button");
  addToFavorite.innerText = "add to favorite";

  pokemonContainer.appendChild(addToFavorite);
  pokemonDiv.appendChild(pokemonContainer);
  pokemonContainer.appendChild(infoBtn)
};

const randomizer = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

pokeFetch();
