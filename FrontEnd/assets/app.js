const api = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
let categoryIdValue = "";
// Définir une variable globale pour stocker les données de l'API
let categories = [];
let btnTitle = [];
const btnSort = document.querySelectorAll(".btn");
const filterButtons = document.createElement("div");
const portfolioSection = document.querySelector("#portfolio");
portfolioSection
  .querySelector("h2")
  .insertAdjacentElement("afterend", filterButtons);
const imageUrls = [];
//*************************************
async function fetchApiWorks() {
  try {
    await fetch(api + "works")
      .then((r) => r.json())
      .then((data) => (cards = data));
    const btnTitle = getButtonTitles(cards);

    console.log(`le titre des BTN filtres  : ${btnTitle.join("  /  ")}`);
    console.log(cards);

    filtersBtn(btnTitle);
    workDisplay(cards);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

async function fetchApiCategories() {
  try {
    await fetch(api + "categories")
      .then((r) => r.json())
      .then((data) => (categories = data));
    console.log(categories);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction fetchApiWorks Cartes des Projets:  ${error}`
    );
  }
}

//*************************************Récupération dynamique de catégories appellé dans le fetch

function getButtonTitles(cards) {
  return [...new Set(cards.map((card) => card.category.name))];
}

//*************************************CRÉATION & INJECTION BOUTON EN HTML

function filtersBtn(btnTitle) {
  // Create button "Tous"
  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  filterButtons.appendChild(allButton);
  filterButtons.classList.add("filter");

  // Destructuring test

  const buttons = [
    allButton,
    ...btnTitle.map((categoryName) => {
      const button = document.createElement("button");
      button.classList.add("btn");
      button.textContent = categoryName;
      filterButtons.appendChild(button);
      return button;
    }),
  ];

  //LOGIQUE CLIQUE pour récupérer le "name" du Button et la Class qui s'ajoute
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      categoryIdValue = e.target.textContent;
      console.log(categoryIdValue);
      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      workDisplay();
    });
  });
}

//************************************ CREATION CARTES WORKS

function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");
  // data set pour étape édition ds Modal
  cardDisplay.setAttribute("data-card-id", card.id);
  cardDisplay.setAttribute("value", card.categoryId);
  //console.log(cardDisplay);
  // INJECTION DE MON IMAGE DS MA CARTE

  const imgCard = document.createElement("img");
  imgCard.setAttribute("src", card.imageUrl);
  imgCard.setAttribute("alt", "photo de " + card.title);

  // INJECTION DU TITRE DS MA CARTE
  const titleCard = document.createElement("figcaption");
  titleCard.textContent = card.title;

  cardDisplay.appendChild(imgCard);
  cardDisplay.appendChild(titleCard);
  portfolioSection.appendChild(cardDisplay);

  // Retourner cartes pour stockage
  return cardDisplay;
}
//*************************************INJECTION DES CARTES DANS LE HTML

function workDisplay() {
  const gallery = document.querySelector(".gallery");
  const cardDisplay = new Set();
  gallery.innerHTML = "";
  cards.forEach((card) => {
    if (categoryIdValue === "Tous" || card.category.name === categoryIdValue) {
      cardDisplay.add(card);
    }
  });
  cardDisplay.forEach((card) => {
    gallery.appendChild(cardsTemplate(card));
  });
}

//*************************************LOGIQUE AU CHARGEMENT DE LA PAGE
window.addEventListener("load", (e) => {
  fetchApiWorks();
  fetchApiCategories();
  categoryIdValue = "Tous";
  checkToken();
});

//*************************************
function checkToken() {
  // Vérifie si le token est dans le localStorage
  const token = localStorage.getItem("token");
  if (token) {
    console.log("Token en mémoire! ");
    adminEdition();
  } else {
    console.log("No have token in memory !");
  }
}

//LOG OUT
function removeToken() {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
  sessionStorage.removeItem("deletedImages");
}

//événement fermeture onglet ou redirection vers un autre site
window.addEventListener("unload", removeToken);
