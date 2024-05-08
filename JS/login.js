import { headers, crudUrl } from "./helpers.js";

const handleLogin = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const data = { username, password };

  console.log("Sending login data:", JSON.stringify({ username, password }));

  const usernames = await fetchUsernames();
  if (usernames.includes(username)) {
    window.location.href = "index.html";
  } else {
    console.log("feil brukernavn");
  }
};

const fetchUsernames = async () => {
  try {
    const response = await fetch(`${crudUrl}/register`, {
      method: "GET",
      headers,
    });
    const usernamesData = await response.json();
    const usernames = usernamesData.items.map((item) => item.username.trim());
    console.log("Fetched usernamesData:", usernames); // Legg til denne for å sjekke datastrukturen
    return usernames;
  } catch (error) {
    console.error("Feil ved henting av brukernavn:", error);
    return [];
  }
};

//legg inn funksjon som logger inn.find sjekker om brukernavn og passord stemmer = return true if (username === username)
//hvis user ikke fins alert feil, hvis user fins, legg i sessionStorage
//lag en funksjon som heter getUser
const handleRegister = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const usernames = await fetchUsernames();
    if (usernames === username) {
      alert("Brukernavnet er allerede tatt. Vennligst velg et annet.");
      return;
    }

    const data = { username, password };
    const response = await fetch(`${crudUrl}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify([data]),
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log("Registrering vellykket:", responseData);
      alert("Registrering vellykket! Vennligst logg inn.");
      toggleForm()
    } else {
      alert("En ukjent feil oppsto. Prøv igjen.");
    }
  } catch (error) {
    console.error("Registreringsfeil:", error);
  }
};

const toggleForm = () => {
  const formTitle = document.getElementById("formTitle");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  if (formTitle.textContent === "Login") {
    formTitle.textContent = "Register";
    loginBtn.value = "Register";
    loginBtn.onclick = handleRegister;
    registerBtn.value = "Login";
    registerBtn.onclick = toggleForm;
  } else {
    formTitle.textContent = "Login";
    loginBtn.value = "Login";
    loginBtn.onclick = handleLogin;
    registerBtn.value = "Register";
    registerBtn.onclick = toggleForm;
  }
};
toggleForm();
