//
const navBouton = document.querySelector(".boutons");
// Création bouton "Tous"
const boutonTous = document.createElement("button");
boutonTous.innerText = "Tous";
// Création bouton "Objets"
const boutonObjets = document.createElement("button");
boutonObjets.innerText = "Objets";
// Création bouton "Appartements"
const boutonAppartements = document.createElement("button");
boutonAppartements.innerText = "Appartements";
// Création bouton "Hôtels & restaurants"
const boutonHotel = document.createElement("button");
boutonHotel.innerText = "Hôtels & restaurants";
//
navBouton.appendChild(boutonTous);
navBouton.appendChild(boutonObjets);
navBouton.appendChild(boutonAppartements);
navBouton.appendChild(boutonHotel);

//Déclare works en tableau variable globale
let works = [];
//Déclare le filtre en variable globale
let filtre = "";
//Insertion d'une variable dans la fonction
genererWorks(filtre);
//Function appel API
async function genererWorks(filtre) {
  const reponse = await fetch("http://localhost:5678/api/works/");
  works = await reponse.json();

  let objectButton = []; //Initialisation
  switch (
    filtre //switch permet de faire une action différente en fonction de la valeur de "filtre"
  ) {
    case "Tous":
      objectButton = works.filter((works) => works.categoryId);
      break;
    case "objets": //Si "filtre" = "objets"
      objectButton = works.filter((works) => works.categoryId == 1);
      break;
    case "Appartements":
      objectButton = works.filter((works) => works.categoryId == 2);
      break;
    case "Hôtels & restaurants":
      objectButton = works.filter((works) => works.categoryId == 3);
      break;
    default:
      objectButton = works; //Dans le cas default (donc dans tout autre cas que ceux mentionnés au dessus), je recupère works qui appelait toutes les cartes
  }

  for (let i = 0; i < objectButton.length; i++) {
    const figure = objectButton[i];
    // Récupération de l'élément du DOM qui accueillera les fiches
    const divGallery = document.querySelector(".gallery");
    // Création d’une balise dédiée à aux figures
    const worksElement = document.createElement("figure");
    // Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = figure.imageUrl;

    const nomElement = document.createElement("p");
    nomElement.innerText = figure.title;

    // On rattache la balise figure a la div Gallery
    divGallery.appendChild(worksElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(nomElement);
  }
}

const boutonObjet = document.querySelector("button");

boutonTous.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  filtre = "Tous";
  genererWorks(filtre);
});
boutonObjets.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  filtre = "objets";
  genererWorks(filtre);
});

boutonAppartements.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  filtre = "Appartements";
  genererWorks(filtre);
});

boutonHotel.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  filtre = "Hôtels & restaurants";
  genererWorks(filtre);
});
