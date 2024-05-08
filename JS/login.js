import { headers, crudUrl } from "./helpers.js";

const handleRegister = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const usernames = await fetchUsernamePassword();
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
      toggleForm();
    } else {
      alert("En ukjent feil oppsto. Prøv igjen.");
    }
  } catch (error) {
    console.error("Registreringsfeil:", error);
  }
};

const fetchUsernamePassword = async () => {
  try {
    const response = await fetch(`${crudUrl}/register`, {
      method: "GET",
      headers,
    });
    const data = await response.json();
    const usernamePassword = data.items.map(item => ({
      username: item.username.trim(),
      password: item.password.trim()
    }));
    console.log("Fetched usernamesData:", usernamePassword); // Legg til denne for å sjekke datastrukturen
    return usernamePassword;
  } catch (error) {
    console.error("Feil ved henting av brukernavn:", error);
    return [];
  }
};

const handleLogin = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const data = { username, password };

  console.log("Sending login data:", JSON.stringify({ username, password }));

  const usernamePassword = await fetchUsernamePassword();
  const user = usernamePassword.find(user => user.username === username && user.password === password);
  if (user) {
    window.location.href = "index.html";
  } else {
    alert("Wrong username or password")
    console.log("feil brukernavn");
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
