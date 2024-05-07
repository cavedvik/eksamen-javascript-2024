
import { pokemonItem, headers, crudUrl } from "./helpers.js";

const pokeFavorites = async () => {
    try {
        const response = await fetch(crudUrl, {
            method: "GET",
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const favoritePokemons = await response.json();
        console.log("Favorites fetched:", favoritePokemons.items);
        displayFavorites(favoritePokemons.items);
    } catch (error) {
        console.error("Error fetching favorites", error)
    }
}



const displayFavorites = (favorites) => {
    const favoriteDiv = document.getElementById("pokeFavorite");
    if (favoriteDiv) {
        favorites.forEach(data => {
            try {
            console.log("Processing favorite:", data);
            pokemonItem(data, favoriteDiv, "pokeFavorite");
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
