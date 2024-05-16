import {
  crudUrl,
  headers,
  logOutUser,
  fetchUsernamePassword,
  visibleProfileLink
} from "./helpers.js";


const userId = localStorage.getItem("id");
const username = localStorage.getItem("username");

//------------Endre brukernavn og passord----------------------

document.getElementById("profileId").innerHTML = `
Profile for user:
 ${username}`;

//chat gpt hjelp
const changeUserInfo = async () => {
  const usernameInput = document.getElementById("changeUsername");
  const passwordInput = document.getElementById("changePassword");
  const newUsername = usernameInput.value.trim();
  const newPassword = passwordInput.value.trim();

  const data = {};
  if (newUsername) {
    data.username = newUsername;
  }
  if (newPassword) {
    data.password = newPassword;
  }

  try {
    if (newUsername) {
      const existingUsers = await fetchUsernamePassword();
      const usernameTaken = existingUsers.find(
        (user) => user.username === newUsername && user.id !== userId
      );

      if (usernameTaken) {
        alert("Username already taken. Choose another");
        return;
      }
    }

    const response = await fetch(`${crudUrl}/register/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Your details have been updated successfully");
      if (newUsername) {
        localStorage.setItem("username", newUsername);
      }
      usernameInput.value = "";
      passwordInput.value = "";
      window.location.reload();
    } else {
      throw new Error("Failed to update user details.");
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    alert("Failed to update your details. Please try again.");
  }
};

const usernameInput = document.getElementById("changeUsername");
const passwordInput = document.getElementById("changePassword");

usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changeUserInfo();
    event.preventDefault();
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changeUserInfo();
    event.preventDefault();
  }
});

document.getElementById("changeUserBtn").addEventListener("click", changeUserInfo);
document.getElementById("changePasswordBtn").addEventListener("click", changeUserInfo);

logOutUser();
visibleProfileLink();
