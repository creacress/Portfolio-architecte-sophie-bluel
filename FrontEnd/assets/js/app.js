//Déclare works et catégorie en tableau Set
const allWorks = new Set();
const allCategories = new Set();
let file = "";

const token = sessionStorage.accessToken;
const worksContainer = document.querySelector(`.worksContainer`);
const modalContainer = document.querySelector(".modalContainer");
const pushModal = document.querySelector(".publier");
const modal1 = document.querySelector(".modal1");

const modal2 = document.querySelector(".modal2");
const upTitle = document.getElementById(`titre`);
const selectCategory = document.getElementById("categorie");
const submitButton = document.querySelector(".valid");

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

//Function flex pour la modale
function modalFlex() {
  const edition = document.querySelector(`.edition`);
  const editBtn = document.querySelectorAll(".editBtn");

  edition.style = `display : flex`;
  login.innerText = `logout`;

  //Afichage btn modif pour modal
  for (const modifBtn of editBtn) {
    modifBtn.style = "display : flex";
    modifBtn.addEventListener("click", (e) => {
      modal1.style.display = `flex`;
      modalContainer.style = `display : flex`;
    });
  }
}

// ** Function affichage galérie modale **
function showWorksInModal() {
  worksContainer.innerHTML = "";
  // Pour chaque travail je :
  allWorks.forEach((work) => {
    const figureModal = document.createElement(`figure`);
    const figureImgModal = document.createElement(`img`);
    const editButton = document.createElement(`button`);
    const delButton = document.createElement(`button`);
    // récupère l'image et le titre
    figureModal.dataset.id = work.id;
    figureImgModal.src = work.imageUrl;
    figureImgModal.alt = work.title;
    editButton.innerText = `éditer`;
    editButton.classList.add(`editer`);
    delButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    delButton.classList.add(`delete`);

    delButton.addEventListener("click", async (e) => {
      const figure = e.target.closest("figure");
      const id = figure.dataset.id;
      const deleteCode = await confirmDelWork(id);
      // chaque cas ... un code d'erreur diff
      switch (deleteCode) {
        case 204:
          figure.remove();
          const galleryFigure = document.querySelector("#figure-" + id);
          galleryFigure.remove();

          // Permet de supp l'img dans le Set
          for (const work of allWorks) {
            if (work.id == id) {
              allWorks.delete(work);
              break;
            }
          }
          break;
        case 401:
          alert("accès non autorisé");
          break;
        case 500:
          alert("problème de serveur, veuillez réesayez plus tard");
          break;
        case "abort":
          alert("opération annulé");
          break;
        default:
          alert("cas imprévu :" + deleteCode);
          break;
      }
    });

    worksContainer.appendChild(figureModal);
    figureModal.append(figureImgModal, editButton, delButton);
  });
}
// --- Confirmation pour suppression ---
async function confirmDelWork(workId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    const deleteStatus = await delWork(workId);
    return deleteStatus;
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
      // -- Affichage modal--
      modalFlex();

      // -- Affichage galérie --
      showWorksInModal();

      // ** Permet de se déloguer ** //
      setLogoutButton();
      //Permet de selectionner les Cat
      getSelectCategory();
      initAddModale();
      //
    } else {
      displayFilterButton();
    }
    genererWorks();
  } catch (error) {
    console.log(
      `Erreur chargement Fonction init cartes des projets:  ${error}`
    );
  }
}
init();

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
    worksElement.id = "figure-" + work.id;
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
  //Ont attribu la classe "active" au btn tous
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

//**************************************************************** */
// Permet d'appuyer et d'afficher la modale
pushModal.addEventListener("click", () => {
  console.log("Bonjour");
  modalContainer.style = `display : flex`;
  modal1.style.display = `flex`;
});
// -- Permet de passer de la modal 1 à 2
function RedirectionModale() {
  const addWork = document.querySelector(".addWork");
  addWork.addEventListener("click", () => {
    modal1.style.display = `none`;
    modal2.style.display = "flex";
  });
}

// -- Test modal 2 ----

if (modal2) {
  RedirectionModale();
  // --- Flèche retour ---//
  const back = document.querySelector(`.back`);
  const closeModal = document.querySelector(".close");

  back.addEventListener(`click`, () => {
    modal1.style.display = `flex`;
    modal2.style.display = `none`;
  });
  closeModal.addEventListener(`click`, () => {
    modal1.style.display = `none`;
    modal2.style.display = `none`;
    modalContainer.style = `display : none`;
  });
  // --- Prévisualisation de l'image ---//
} else {
}

// --- Récupération dynamique des catégories pour ajout de projet ---

function getSelectCategory() {
  const selectCategory = document.getElementById("categorie");

  for (const categorie of allCategories) {
    const option = document.createElement("option");
    option.textContent = categorie.name;
    option.value = categorie.id;
    selectCategory.appendChild(option);
  }
}

function initAddModale() {
  const img = document.querySelector("#uploadImg");

  img.addEventListener("change", (e) => {
    const tempFile = e.target.files[0];
    const fileTypes = ["image/jpg", "image/png"];
    let testFormat = false;
    for (let i = 0; i < fileTypes.length; i++) {
      if (tempFile.type === fileTypes[i]) {
        testFormat = true;
      }
    }
    if (testFormat) {
      if (tempFile.size <= 1024 * 1024 * 1024) {
        const preview = document.querySelector("#preview");
        const imageUrl = URL.createObjectURL(tempFile);
        preview.src = imageUrl;
        file = tempFile;
      } else {
        return alert("taille incorrect 4mo max");
      }
    } else {
      return alert("ce format ets incorrect PNJ/JPG attendu");
    }
  });

  // --- Requete POST pour envoyer un nouveau work ---
  submitButton.addEventListener("click", async (e) => {
    //permet d'éviter la page de s'ouvrir
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", upTitle.value);
    formData.append("category", selectCategory.value);
    if (file != "" && upTitle != "") {
      modal2.style.display = `none`;
      modal1.style.display = `flex`;
      const newWork = await AddWork(formData);
      allWorks.add(newWork);
      showWorksInModal();
      genererWorks();
      upTitle.value = "";
      uploadImg.files[0] = "";
      preview.src = "";
      file = "";
      URL.revokeObjectURL(file);
    } else {
      const error = document.createElement("p");
      error.innerText = "Titre, Catégorie, Taille < 4Mo requis";
      error.style.textAlign = `center`;
      error.style.color = `red`;
      sendImg.appendChild(error);
    }
  });
}

// Function pour délogue =>
function setLogoutButton() {
  const logout = document.getElementById(`login`);
  logout.textContent = "logout";
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.clear();
    window.location.reload();
  });

  // --- Fermeture de la modale ---
  window.addEventListener("click", function (e) {
    if (e.target === modalContainer) {
      modalContainer.style.display = "none";
      modal2.style.display = `none`;
    }
  });
  // --- Suppression du token si logout ---
  login.addEventListener("click", function () {
    if (token) {
      location.href = "http://" + location.hostname + ":5500/index.html";
      sessionStorage.removeItem("accessToken");
      location.reload();
    }
  });
}

// --- Requète DELETE pour supprimer un projet ---
async function delWork(id) {
  const response = await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response);
  return response.status;
}

// event listener sur bouton validé, on récupére les info, on le stest et on envoie en fetch si c'est bon
async function AddWork(formData) {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (response.ok) {
    return response.json();
  }
}

//
