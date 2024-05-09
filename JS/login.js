import { headers, crudUrl, logOutUser } from "./helpers.js";

const handleRegister = async () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const existingUsers = await fetchUsernamePassword();
    const usernameTaken = existingUsers.some(
      (user) => user.username === username
    );

    if (usernameTaken) {
      alert("Username alredy taken. Choose another");
    }
    const data = { username, password };
    const response = await fetch(`${crudUrl}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify([data]),
    });

    if (response.ok && !usernameTaken) {
      const responseData = await response.json();
      console.log("Registrering vellykket:", responseData);
      alert("Registrering vellykket! Vennligst logg inn.");
      usernameInput.value = '';
      passwordInput.value = '';
      toggleForm();
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
    return data.items
  } catch (error) {
    console.error("Feil ved henting av brukernavn:", error);
    return [];
  }
};

const handleLogin = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const data = { username, password };

  console.log("Sending login data:", JSON.stringify({ data }));

  const usernamePassword = await fetchUsernamePassword();
  const user = usernamePassword.find(
    (user) => user.username === username && user.password === password);
  if (user) {
    window.location.href = "index.html";
    sessionStorage.setItem("username", username)
  } else {
    alert("Wrong username or password");
    console.log("feil brukernavn");
  }

  //session storage

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
logOutUser()

