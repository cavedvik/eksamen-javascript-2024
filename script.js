// globale varianler
const baseURL = "https://crudapi.co.uk/api/v1";
const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer -lHHnLLnpSM7jT474Sv_tD1MaGTDVdtqBUV1-GWX9QoUCFg9Hg",
};
//Loginn og registrering
const login = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = { username, password };
    console.log("Sending login data:", JSON.stringify([data]));  // Lagt til array
    try {
        const response = await fetch(`${baseURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer -lHHnLLnpSM7jT474Sv_tD1MaGTDVdtqBUV1-GWX9QoUCFg9Hg"
            },
            body: JSON.stringify([data])  // Endret for å sende data som en liste
        });
        const responseData = await response.json();
        console.log("API Response:", responseData);
    } catch (error) {
        console.error("Innloggingsfeil:", error);
    }
};





