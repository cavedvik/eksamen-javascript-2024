import { headers, crudUrl, logOutUser, updateFavoritesCount, fetchUsernamePassword } from "./helpers.js";

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
      usernameInput.value = "";
      passwordInput.value = "";
      loginRegistrerForms();
    }
  } catch (error) {
    console.error("Registreringsfeil:", error);
  }
};


const handleLogin = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill in both username and password");
    return;
  }

  const data = { username, password };
  console.log("Sending login data:", JSON.stringify({ data }));

  const usernamePassword = await fetchUsernamePassword();
  const user = usernamePassword.find(
    (user) => user.username === username && user.password === password
  );
  console.log(user)
  if (user) {
    window.location.href = "index.html";
    localStorage.setItem("username", username);
    localStorage.setItem("id", user._uuid);
  } else {
    alert("Wrong username or password");
    console.log("feil brukernavn");
  }
};


const loginRegistrerForms = () => {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const backToLogin = document.getElementById("backToLogin")
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  loginBtn?.addEventListener("click", handleLogin);

  if (window.location.pathname.includes('login.html')) {
    registerBtn?.addEventListener("click", () => {
      window.location.href = "registrer.html";
    });
    
  } else if (window.location.pathname.includes('registrer.html')) {
    registerBtn?.addEventListener("click", async () => {
      await handleRegister();
      window.location.href = "login.html"
    });
    backToLogin.addEventListener("click", () => {
      window.location.href = "login.html";
    })
  }
};


updateFavoritesCount()
loginRegistrerForms();
logOutUser();
