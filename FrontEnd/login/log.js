// LOGIQUE LOGIN
const loginUrl = "http://localhost:5678/api/users/login";
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const submitBtn = document.querySelector("input[type='submit']");
const form = document.getElementById("loginForm");
const loginError = document.querySelector(".loginError");
const passwordError = document.querySelector(".passwordError");
//Evenement au chargement du DOM**********************eeeeeeeeeeeeeeee
document.addEventListener("DOMContentLoaded", (e) => {
  logUser.email = inputEmail.value;
  logUser.password = inputPassword.value;
  console.log(logUser);
});

const logUser = {
  email: "",
  password: "",
};

// *****************************************************************************************************

// Event MAIL
inputEmail.addEventListener("input", (e) => {
  //inputEmail.setCustomValidity("nooooooo");
  inputEmail.reportValidity();
  logUser.email = e.target.value;
});

// Event  Password
inputPassword.addEventListener("input", (e) => {
  //inputEmail.setCustomValidity("no");
  inputPassword.reportValidity();
  logUser.password = e.target.value;
});

// *****************************************************************************************************
// Fetch user

async function loginUser() {
  try {
    await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logUser),
    })
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData;
      });
    if (data.message) {
      loginError.textContent = "Erreur dans l’identifiant !!";
      inputEmail.style.color = "red";
    } else if (data.error) {
      passwordError.textContent = "Erreur dans le mot de passe !!";
      loginError.textContent = "";
      inputPassword.style.color = "red";
      inputEmail.style.color = "#1d6154";
    } else {
      inputPassword.style.color = "#1d6154";
      passwordError.textContent = "";
      loginError.textContent = "";

      // stockage du token dans le stockage local
      localStorage.setItem("token", data.token);
      //Redirection index.html
      window.location.href = "../index.html";
    }
  } catch (error) {
    console.log(error);
  }
}
