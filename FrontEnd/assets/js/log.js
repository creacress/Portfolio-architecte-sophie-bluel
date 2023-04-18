/*
// bouton de retour vers la page dacceuil
const projet = document.querySelector("#projets");
projet.addEventListener("click", function () {
  location.href = "index.html";
});

// Étape 2.2 : Authentification de l’utilisateur

function connexion() {
  const formulaireConnexion = document.querySelector(".formLogin");
  console.log(formulaireConnexion);
  //fonction pour valider l'adresse mail
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  let messageValideEmail = document.querySelector(".valideEmail");

  formulaireConnexion.addEventListener("submit", async function (event) {
    event.preventDefault();
    //
    const user = {
      email: event.target.querySelector("[name=email").value,
      password: event.target.querySelector("[name=password").value,
    };

    const emailInput = document.querySelector("#email");
    const email = emailInput.value;
    if (validateEmail(email)) {
      messageValideEmail.style.visibility = "hidden";

      //envoie a l'api
      const result = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      //on récupère la réponse
      const response = await result.json();
      console.log(response);

      if (!result.ok) {
        document.querySelector(".erreurLogin").style.visibility = "visible";
        console.log(result);
      } else {
        localStorage.setItem("token", response.token);
        const token = localStorage.getItem("token");
        location.href = "index.html";
      }
    } else {
      messageValideEmail.style.visibility = "visible";
    }
  });
}

connexion();
/************************************************ */

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  e.preventDefault();
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (response.ok) {
    const data = await response.json();
    sessionStorage.setItem("accessToken", data.token);
    window.location.href =
      "http://" + window.location.hostname + ":5500/index.html";
  } else {
    const connexion = document.querySelector("div");
    const error = document.createElement("p");
    error.innerText = `"Erreur dans l’identifiant ou le mot de passe"`;
    error.style.textAlign = `center`;
    error.style.color = `red`;
    error.style.marginBottom = `15px`;
    connexion.insertBefore(error, connexion.lastElementChild);
  }
});
