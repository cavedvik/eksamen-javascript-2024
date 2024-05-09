import { pokemonItem, headers, crudUrl, logOutUser } from "./helpers.js";

const pokeFavorites = async () => {
    const username = localStorage.getItem("username");
    try {
        const response = await fetch(`${crudUrl}/pokemons`, {
            method: "GET",
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const favoritePokemons = await response.json();
        const items = favoritePokemons.items.filter(item => item.username === username)
        console.log("Favorites fetched:", favoritePokemons.items);
        displayFavorites(items);
    } catch (error) {
        console.error("Error fetching favorites", error);
    }
}


const displayFavorites = (favorites) => {
    const favoriteDiv = document.getElementById("pokeFavorite");
    if (favoriteDiv) {
        favorites.forEach((data) => {
            try {
            console.log("Processing favorite:", data);
            pokemonItem(data, favoriteDiv);
            } catch (error) {
                console.error("Error processing favorite item", error)
            }
            
        });
    } else {
        console.error("Failed to find 'pokefavorite' element.");
    }
    console.log("Displayed favorites:", favorites);
    
}



pokeFavorites();
logOutUser();
