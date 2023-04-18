const btns = document.querySelector(`.btns`);
const token = sessionStorage.accessToken;
const edition = document.querySelector(`.edition`);
const modifier = document.querySelectorAll(`.modifier`);
const login = document.getElementById(`login`);
const displayModal = document.querySelector(`.modifier3`);
const modalContainer = document.querySelector(`.modalContainer`);
const modal = document.getElementById(`modal`);
const modal2 = document.getElementById(`modal2`);
const close = document.querySelectorAll(".close");
const worksContainer = document.querySelector(`.worksContainer`);
const delButton = document.querySelector(`.delete`);
const addWork = document.querySelector(`.addWork`);
const back = document.querySelector(`.back`);
const upTitle = document.getElementById(`titre`);
const uploadImg = document.getElementById(`uploadImg`);
const selectCategory = document.getElementById("categorie");
const submitButton = document.querySelector(".valid");
let preview = document.getElementById("preview");
let arrWorks = [];

// --- Conditions pour mise en page si token valide ---
if (token) {
  edition.style = `display: flex`;
  login.innerText = `logout`;
  modifier.forEach((button) => {
    button.style.display = "flex";
  });
  btns.style = `display: none`;
}

// --- Affichage de la modale ---
/*function showModal() {
  displayModal.addEventListener("click", function (e) {
    modalContainer.style.display = "flex";
    modal.style.display = `flex`;
  });
}
showModal();*/

// --- Fermeture de la modale ---
document.addEventListener("click", function (e) {
  if (e.target === modalContainer) {
    modalContainer.style.display = "none";
    modal2.style.display = `none`;
  }
});

function closeModal() {
  modalContainer.style.display = "none";
  modal2.style.display = "none";
}
close.forEach(function (button) {
  button.addEventListener("click", closeModal);
});

// --- Affichage de la galerie dans la modale ---
async function showWorksInModal() {
  arrWorks = await getWorks();

  arrWorks.forEach((work) => {
    const figureModal = document.createElement(`figure`);
    const figureImgModal = document.createElement(`img`);
    const editButton = document.createElement(`button`);
    const delButton = document.createElement(`button`);
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
showWorksInModal();

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

// --- "Redirection" vers ajout d'un projet ---
addWork.addEventListener(`click`, function () {
  modal.style.display = `none`;
  modal2.style.display = `flex`;
  checkConditions();
});

// --- Flèche retour ---
back.addEventListener(`click`, function () {
  modal.style.display = `flex`;
  modal2.style.display = `none`;
  preview.src = "";
  upTitle.value = "";
});

// --- Récupération dynamique des catégories pour ajout de projet ---
async function getSelectCategory() {
  const category = await getCategories();

  for (let i = 1; i < category.length; i++) {
    const option = document.createElement("option");
    option.textContent = category[i].name;
    option.value = category[i].id;
    selectCategory.appendChild(option);
  }
}
getSelectCategory();

// --- Conditions pour le bouton Valider ---
const checkConditions = () => {
  if (
    uploadImg.files[0]?.size < 4000000 &&
    upTitle.value !== "" &&
    selectCategory.value !== ""
  ) {
    submitButton.classList.add("envoyer");
  } else {
    submitButton.classList.remove("envoyer");
  }
};
upTitle.addEventListener("input", checkConditions);
selectCategory.addEventListener("input", checkConditions);
uploadImg.addEventListener("input", checkConditions);

// --- Requete POST pour envoyer un nouveau work ---
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = new FormData(document.getElementById("sendImg"));
  formData.append("image", uploadImg.files[0]);
  formData.append("title", upTitle.value);
  formData.append("category", selectCategory.value);
  if (submitButton.classList.contains("envoyer")) {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    modal2.style.display = `none`;
    modal.style.display = `flex`;
    worksContainer.innerHTML = "";
    showWorksInModal();
    showWorksByCategory(0);
    upTitle.value = "";
    uploadImg.files[0] = "";
    preview.src = "";
  } else {
    const error = document.createElement("p");
    error.innerText = "Titre, Catégorie, Taille < 4Mo requis";
    error.style.textAlign = `center`;
    error.style.color = `red`;
    sendImg.appendChild(error);
  }
});

// --- Prévisualisation de l'image ---
function previewImage(event) {
  preview.src = "";
  const file = event.target.files[0];
  const imageUrl = URL.createObjectURL(file);
  preview.src = imageUrl;
}

// --- Suppression du token si logout ---
login.addEventListener("click", function () {
  if (token) {
    sessionStorage.removeItem("accessToken");
    location.reload();
  }
});
