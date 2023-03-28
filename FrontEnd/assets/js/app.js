const api = "http://localhost:5678/api/";
//const token = localStorage.getItem("token");
// Définir une variable globale pour stocker les données de l'API
// Création des objets
const allWorks = new Set();
const objWorks = new Set();
const aptWorks = new Set();
const hotWorks = new Set();
const allCats = new Set();
const btnSort = document.querySelectorAll(".btn");
const portfolioSection = document.querySelector("#portfolio h2");

// Appel API + affichage projets

async function getAllDatabaseInfo(type) {
  const response = await fetch(api + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response.error);
  }
}

function sortWorks(works) {
  for (const work of works) {
    allWorks.add(work);
    switch (work.categoryId) {
      case 1:
        objWorks.add(work);
        break;
      case 2:
        aptWorks.add(work);
        break;
      case 3:
        hotWorks.add(work);
        break;
      default:
        break;
    }
  }
}
//*************************************
// Ininitialisation de chargements des projets
async function init() {
  try {
    const works = await getAllDatabaseInfo("works");
    sortWorks(works);
    workDisplay(allWorks);
    displayFilterButton(allCats);
  } catch (error) {
    console.log(
      `Erreur chargement Fonction init cartes des projets:  ${error}`
    );
  }
}

init();

async function displayFilterButton() {
  const categories = await getAllDatabaseInfo("categories");
  const filterButtons = document.createElement("div");
  filterButtons.classList.add("filter");
  // Create button "Tous"
  const allButton = document.createElement("button");
  allButton.classList.add("btn", "active");
  allButton.textContent = "Tous";
  const fragment = document.createDocumentFragment();
  fragment.appendChild(allButton);

  // créer les différent bouton les mettre dans le fragment

  const objectButton = document.createElement("button");
  objectButton.textContent = "Objet";
  fragment.appendChild(objectButton);

  const appartementButton = document.createElement("button");
  appartementButton.textContent = "Appartement";
  fragment.appendChild(appartementButton);

  const hotelButton = document.createElement("button");
  hotelButton.textContent = "Hôtels et restaurants";
  fragment.appendChild(hotelButton);

  console.log(fragment);
}

//mettre le fragment dans le html
function sortCategory(categories) {
  for (const categorie of categories) {
    categories.add(categorie);
    switch (categorie.categoryId) {
      case 1:
        objWorks.add(categorie);
        break;
      case 2:
        aptWorks.add(categorie);
        break;
      case 3:
        hotWorks.add(categorie);
        break;
      default:
        break;
    }
  }
}
//*************************************CRÉATION & INJECTION BOUTON EN HTML

//function filtersBtn(btnTitle) {
//appel function getAllCategory

//LOGIQUE CLIQUE pour récupérer le "name" du Button et la Class qui s'ajoute
/*
btns = filterButtons.querySelectorAll("button");
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    categoryIdValue = e.target.textContent;
    console.log(categoryIdValue);
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    workDisplay();
  });
});*/

//************************************ CREATION  WORKS

function cardsTemplate(card) {
  const cardDisplay = document.createElement("figure");
  // data set pour étape édition ds Modal
  cardDisplay.dataset.id = card.id;
  cardDisplay.dataset.cardId = card.categoryId;
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

  // Retourner cartes pour stockage
  return cardDisplay;
}
//*************************************INJECTION DES CARTES DANS LE HTML

function workDisplay(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (const work of works) {
    fragment.appendChild(cardsTemplate(work));
  }
  gallery.appendChild(fragment);
}

/*
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
window.addEventListener("unload", removeToken);*/
