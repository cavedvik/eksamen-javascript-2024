import {
  headers,
  crudUrl,
  logOutUser,
  updateFavoritesCount,
  fetchUsernamePassword,
  visibleProfileLink,
} from "./helpers.js";

//---------------Registrere og logg inn---------------------------

const handleRegister = async () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Both username and password must be filled out.");
    return;
  }
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
      alert("Registration successful! Please log in.");
      usernameInput.value = "";
      passwordInput.value = "";
      loginRegistrerForms();
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Registration error:", error);
  }
};

const handleLogin = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please fill in both username and password");
    return;
  }

  const usernamePassword = await fetchUsernamePassword();
  const user = usernamePassword.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    window.location.href = "index.html";
    localStorage.setItem("username", username);
    localStorage.setItem("id", user._uuid);
  } else {
    alert("Wrong username or password");

  }
};

const loginRegistrerForms = () => {
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const backToLogin = document.getElementById("backToLogin");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const enterKeyPress = (event) => {
    if (event.key === "Enter") {
      if (window.location.pathname.includes("login.html")) {
        handleLogin();
      } else if (window.location.pathname.includes("registrer.html")) {
        handleRegister();
      }
    }
  };

  usernameInput.addEventListener("keydown", enterKeyPress);
  passwordInput.addEventListener("keydown", enterKeyPress);

  loginBtn?.addEventListener("click", handleLogin);

  if (window.location.pathname.includes("login.html")) {
    registerBtn?.addEventListener("click", () => {
      window.location.href = "registrer.html";
    });
  } else if (window.location.pathname.includes("registrer.html")) {
    registerBtn?.addEventListener("click", async () => {
      await handleRegister();
      window.location.href = "login.html";
    });
    backToLogin.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
};

updateFavoritesCount();
loginRegistrerForms();
visibleProfileLink();
logOutUser();


