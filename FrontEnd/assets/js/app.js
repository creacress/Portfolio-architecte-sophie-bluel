//Déclare works et catégorie en tableau Set
const allWorks = new Set();
const allCategories = new Set();
const arrWorks = new Set();

const token = sessionStorage.accessToken;
const worksContainer = document.querySelector(`.worksContainer`);

// fonction qui récupére les info de la bdd
async function getAllDatabaseInfo(type) {
  //on enregistre dans une variable la réponse de la bdd que l'on a attendu
  const response = await fetch("http://localhost:5678/api/" + type);
  // si il n'ya aucune erreur, on renvoie le contenu de la réponse
  if (response.ok) {
    return response.json();
    //si une erreur est présente, on l'affiche dans le log et on ne fait rien
  } else {
    console.log(response.error);
  }
}

// Function flex pour la modale
function modalFlex() {
  const edition = document.querySelector(`.edition`);
  const modalContainer = document.querySelector(".modalContainer");
  const modal1 = document.querySelector(".modal1");
  const modal2 = document.querySelector(".modal2");
  const modifier = document.querySelectorAll(".modifier");

  edition.style = `display : flex`;
  login.innerText = `logout`;
  modalContainer.style = `display : flex`;
  modal1.style.display = `display : flex`;
  // J 'AI BESOIN DE SAVOIR PK IL FAIS LE TETU !
  //modifier.style.display = `display : flex`;
  //modal2.style.display = `display : flex`;
}

// ** Function affichage galérie modale **
function showWorksInModal() {
  // Pour chaque travail je :
  allWorks.forEach((work) => {
    const figureModal = document.createElement(`figure`);
    const figureImgModal = document.createElement(`img`);
    const editButton = document.createElement(`button`);
    const delButton = document.createElement(`button`);
    // récupère l'image et le titre
    figureImgModal.src = work.imageUrl;
    figureImgModal.alt = work.title;
    editButton.innerText = `éditer`;
    editButton.classList.add(`editer`);
    delButton.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    delButton.classList.add(`delete`);
    delButton.addEventListener("click", function () {
      confirmDelWork(work.id);
    });
    worksContainer.appendChild(figureModal);
    figureModal.append(figureImgModal, editButton, delButton);
  });
}

// --- Requète DELETE pour supprimer un projet ---
async function delWork(workId) {
  const response = await fetch("http://localhost:5678/api/works/1", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  console.log(result);
}
// --- Confirmation pour suppression ---
function confirmDelWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    delWork(workId);
    worksContainer.innerHTML = "";
    showWorksInModal();
    showWorksByCategory(0);
  }
}
// Ininitialisation de chargements des projets
async function init() {
  try {
    // initialisation des 2 tableau SET en appelant la base de données et enregistrant les info une par une
    const works = await getAllDatabaseInfo("works");
    for (const work of works) {
      allWorks.add(work);
    }
    const categories = await getAllDatabaseInfo("categories");
    for (const categorie of categories) {
      allCategories.add(categorie);
    }
    //Modal

    if (token) {
      // -- Affichage modale --

      modalFlex();

      // -- Affichage galérie --

      showWorksInModal();

      // modifier.forEach(() => {
      //   a.style.display = "flex";
      // });
      // a.style = `display: none`;
    } else {
      displayFilterButton();
    }
  } catch (error) {
    console.log(
      `Erreur chargement Fonction init cartes des projets:  ${error}`
    );
  }
}
init();

// Permet de se déloguer =>
function setLogoutButton() {
  const logout = document.getElementById(`login`);
  logout.textContent = "logout";
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.reload();
  });
}

function genererWorks(filtre = 0) {
  let filtredWorks = allWorks;
  if (filtre != 0) {
    // [...works] transforme le set works en liste pour utiliser le filter
    filtredWorks = [...allWorks].filter((work) => work.categoryId == filtre);
  }

  // Récupération de l'élément du DOM qui accueillera les fiches
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";
  for (const filtredWork of filtredWorks) {
    const work = filtredWork;
    // Création d’une balise dédiée à aux figures
    const worksElement = document.createElement("figure");
    worksElement.dataset.id = work.id;
    // Création des balises
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    const nameElement = document.createElement("figcaption");
    nameElement.textContent = work.title;

    // On rattache la balise figure a la div Gallery
    divGallery.appendChild(worksElement);
    worksElement.appendChild(imgElement);
    worksElement.appendChild(nameElement);
  }
}

function displayFilterButton() {
  const divButtons = document.querySelector(".filtres");
  const fragment = document.createDocumentFragment();
  const allFilter = document.createElement("div");
  allFilter.classList.add("active");
  allFilter.classList.add("filter");
  allFilter.dataset.id = 0;
  allFilter.textContent = "Tous";
  fragment.appendChild(allFilter);
  for (const categorie of allCategories) {
    const filterButton = document.createElement("div");
    filterButton.classList.add("filter");
    filterButton.dataset.id = categorie.id;
    filterButton.textContent = categorie.name;
    fragment.appendChild(filterButton);
  }
  divButtons.appendChild(fragment);
  setFilterEvent();
}

function setFilterEvent() {
  const buttons = document.querySelectorAll(".filter");
  for (const button of buttons) {
    button.addEventListener("click", (e) => {
      const clickedButton = e.target;
      const categoryId = parseInt(clickedButton.dataset.id);
      genererWorks(categoryId);
      document.querySelector(".active").classList.remove("active");
      clickedButton.classList.add("active");
    });
  }
}
