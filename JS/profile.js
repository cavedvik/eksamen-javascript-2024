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

const changeUsername = async () => {
 const username = localStorage.getItem("username")
  const usernameInput = document.getElementById("changeUsername");
  const newUsername = usernameInput.value.trim();

  const data = {};
  if (newUsername) {
    data.username = newUsername
  };

  try {
    const existingUsers = await fetchUsernamePassword();
    const usernameTaken = existingUsers.find(
      (user) => user.username === newUsername && user.id !== userId
    );

    if (usernameTaken) {
      alert("Username already taken. Choose another");
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
      window.location.reload();
    } else {
      throw new Error("Feiled to update user details.");
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    alert("Failed to update your details. pleas try again.");
  }
};

const changePassword = async () => {
  const username = localStorage.getItem("id")
   const passwordInput = document.getElementById("changePassword");
   const newPassword = passwordInput.value.trim();
 
   const data = {};
   if (newPassword) {
    data.password = newPassword;
  }
 
   try {
     const response = await fetch(`${crudUrl}/register/${userId}`, {
       method: "PUT",
       headers,
       body: JSON.stringify(data),
     });
 
     if (response.ok) {
       const responseData = await response.json();
       console.log("user update ok,", responseData);
       alert("Your details have been updated successfully");
       passwordInput.value = "";
       window.location.reload();
     } else {
       throw new Error("Failed to update user details.");
     }
   } catch (error) {
     console.error("Error updating user details:", error);
     alert("Failed to update your details. pleas try again.");
   }
 };

 document.getElementById("profileId").innerHTML = `
Profile for user:
 ${username}`;

const usernameInput = document.getElementById("changeUsername");
const passwordInput = document.getElementById("changePassword");

usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changeUsername();
    event.preventDefault(); 
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    changePassword();
    event.preventDefault(); 
  }
});

document.getElementById("changeUserBtn").addEventListener("click", changeUsername);
document.getElementById("changePasswordBtn").addEventListener("click", changePassword);


logOutUser()
visibleProfileLink()

