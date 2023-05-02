// Sélectionne le formulaire et ajoute un écouteur d'événements pour la soumission
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  // Récupère l'e-mail et le mot de passe entrés par l'utilisateur
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // Empêche le formulaire de se soumettre automatiquement
  e.preventDefault();
  // Envoie une requête POST à l'API pour se connecter avec les informations d'identification de l'utilisateur
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Ajoute les informations d'identification dans le corps de la requête
    body: JSON.stringify({ email, password }),
  });
  // Si la réponse est réussie
  if (response.ok) {
    // Récupère les données de la réponse
    const data = await response.json();
    // Stocke le jeton d'accès dans la session de l'utilisateur
    sessionStorage.setItem("accessToken", data.token);
    // Redirige l'utilisateur vers la page d'accueil
    window.location.href =
      "http://" + window.location.hostname + ":5500/index.html";
    // Si la réponse est un échec
  } else {
    // Sélectionne l'élément HTML où afficher le message d'erreur
    const connexion = document.querySelector("div");
    // Crée un élément HTML pour afficher le message d'erreur
    const error = document.createElement("p");
    // Définit le texte du message d'erreur
    error.innerText = `"Erreur dans l’identifiant ou le mot de passe"`;
    // Centre le texte du message d'erreur
    error.style.textAlign = `center`;
    // Définit la couleur du texte du message d'erreur
    error.style.color = `red`;
    // Ajoute une marge en bas du message d'erreur
    error.style.marginBottom = `15px`;
    // Insère le message d'erreur avant le dernier élément enfant de l'élément HTML sélectionné
    connexion.insertBefore(error, connexion.lastElementChild);
  }
});
