import {
  crudUrl,
  headers,
  logOutUser,
  fetchUsernamePassword,
  
} from "./helpers.js";
const userId = localStorage.getItem("id");

const changeProfil = async () => {
  // const userId = localStorage.getItem("id");
  const usernameInput = document.getElementById("changeUsername");
  const passwordInput = document.getElementById("changePassword");
  const newUsername = usernameInput.value.trim();
  const newPassword = passwordInput.value.trim();

  const data = {};
  if (newUsername) data.username = newUsername;
  if (newPassword) data.password = newPassword;

  try {
    const existingUsers = await fetchUsernamePassword();
    const usernameTaken = existingUsers.some(
      (user) => user.username === newUsername && user.id !== userId
    );

    if (usernameTaken) {
      alert("Username alredy taken. Choose another");
      return
    }
    const response = await fetch(`${crudUrl}/register/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("user update ok,", responseData);
      alert("Your details have been updated successfully");
      localStorage.setItem("username", newUsername);
      usernameInput.value = "";
      passwordInput.value = "";
      window.location.reload();
    } else {
      throw new Error("Feiled to update user details.");
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    alert("Failed to update your details. pleas try again.");
  }
};

document.getElementById("changeUserBtn").addEventListener("click", () => {
  changeProfil();
});

logOutUser()
