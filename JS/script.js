
const url = "https://pokeapi.co/api/v2/pokemon?limit=20";

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
    const response = await fetch(url);
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
    console.log(pokemonData);
  } catch (error) {
    console.error("there is a problem fetching the Pokemon details", error);
  }
};

const pokemonItem = (pokemonData, speciesData) => {
  const pokemonDiv = document.getElementById("pokeApi");
  const pokemonContainer = document.createElement("div");

  // Finner fargen basert på Pokémon's første type
  const typeColor = pokemonColors[pokemonData.types[0].type.name] || '#ffffff'; // Default til hvit hvis ikke funnet

  pokemonContainer.style.cssText = `
      background-color: ${typeColor};
      border-radius: 10px;
      width: 300px;
      padding: 10px;
      margin: 10px;
      `;

  if (pokemonData.sprites?.front_default) {
    const imageElement = document.createElement("img");
    imageElement.style.cssText = `width: 200px; height: 200px;`;
    imageElement.src = pokemonData.sprites.other["official-artwork"].front_shiny;
    imageElement.loading = "lazy";
    pokemonContainer.appendChild(imageElement);
  }

  const nameElement = document.createElement("h1");
  nameElement.textContent = pokemonData.name;
  pokemonContainer.appendChild(nameElement);

  const typesElement = document.createElement("p");
  typesElement.textContent = `${pokemonData.types.map(t => t.type.name).join(', ')}`;
  pokemonContainer.appendChild(typesElement);

  const infoBtn = document.createElement("button");
  infoBtn.innerText = "Info";
  pokemonContainer.appendChild(infoBtn);

  const addToFavorite = document.createElement("button");
  addToFavorite.innerText = "Add to Favorite";
  pokemonContainer.appendChild(addToFavorite);

  pokemonDiv.appendChild(pokemonContainer);
};


const randomizer = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

pokeFetch();



