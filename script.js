const url = "https://pokeapi.co/api/v2/pokemon";

const pokeFetch = async () => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error" + response.status);
        }
        const data = await response.json();
        console.log(data.results)
    } catch (error) {
        console.error("There is a problem fetching the data", error);
    }
};

pokeFetch()

