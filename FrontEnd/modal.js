import { displayWork } from "./script.js";

function createUploadImg() {
  // Formulaire ajout photo
  const uploadArea = document.createElement("div");
  uploadArea.classList.add("upload-area");

  const uploadImg = document.createElement("img");
  uploadImg.src = "./assets/icons/picture-import.png";
  uploadImg.alt = "image";

  const uploadLabel = document.createElement("label");
  uploadLabel.setAttribute("for", "image-upload");
  uploadLabel.classList.add("upload-button");
  uploadLabel.textContent = "+ Ajouter photo";

  const fileInput = document.createElement("input");
  fileInput.type = "file"; // input de type fichier pour l'upload
  fileInput.id = "image-upload"; // id pour le label et la validation
  fileInput.accept = "image/png, image/jpeg"; // restriction aux formats jpg et png
  fileInput.name = "image"; // name pour l'envoi dans le formData de la requête POST

  const uploadHint = document.createElement("p");
  uploadHint.textContent = "jpg, png : 4mo max";

  uploadArea.appendChild(uploadImg); // image d'upload
  uploadArea.appendChild(uploadLabel);
  uploadArea.appendChild(fileInput);
  uploadArea.appendChild(uploadHint);

 return uploadArea;
}

// création de la modal en JS
async function createModal() {

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "modal-overlay";
  modalOverlay.classList.add("hidden");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  // bouton fermer
  const closeButton = document.createElement("button");
  closeButton.id = "modal-close";
  closeButton.textContent = "✕";

  //galerie
  const galleryView = document.createElement("div");
  galleryView.id = "modal-gallery-view";

  const galleryTitle = document.createElement("h3");
  galleryTitle.textContent = "Galerie photo";

  const modalGallery = document.createElement("div");
  modalGallery.id = "modal-gallery";

  const separator1 = document.createElement("div");
  separator1.classList.add("modal-separator");

  const addPhotoButton = document.createElement("button");
  addPhotoButton.id = "add-photo";
  addPhotoButton.textContent = "Ajouter une photo";

  galleryView.appendChild(galleryTitle); // titre de la galerie ajouté avant la boucle d'affichage des travaux pour éviter les problèmes de structure HTML et de style
  galleryView.appendChild(modalGallery);
  galleryView.appendChild(separator1);
  galleryView.appendChild(addPhotoButton);

  // 2éme page modal
  const addPhotoView = document.createElement("div");
  addPhotoView.id = "modal-add-photo";
  addPhotoView.classList.add("hidden");

  const backButton = document.createElement("button");
  backButton.id = "modal-back";
  backButton.textContent = "←";

  const addPhotoTitle = document.createElement("h3");
  addPhotoTitle.textContent = "Ajout photo";

  const form = document.createElement("form");
  form.id = "add-photo-form";

  // // Formulaire ajout photo
  const uploadArea = createUploadImg();
  // uploadArea.classList.add("upload-area");

  // const uploadImg = document.createElement("img");
  // uploadImg.src = "./assets/icons/picture-import.png";
  // uploadImg.alt = "image";

  // const uploadLabel = document.createElement("label");
  // uploadLabel.setAttribute("for", "image-upload");
  // uploadLabel.classList.add("upload-button");
  // uploadLabel.textContent = "+ Ajouter photo";

  // const fileInput = document.createElement("input");
  // fileInput.type = "file"; // input de type fichier pour l'upload
  // fileInput.id = "image-upload"; // id pour le label et la validation
  // fileInput.accept = "image/png, image/jpeg"; // restriction aux formats jpg et png
  // fileInput.name = "image"; // name pour l'envoi dans le formData de la requête POST

  // const uploadHint = document.createElement("p");
  // uploadHint.textContent = "jpg, png : 4mo max";

  // uploadArea.appendChild(uploadImg); // image d'upload
  // uploadArea.appendChild(uploadLabel);
  // uploadArea.appendChild(fileInput);
  // uploadArea.appendChild(uploadHint);

  // Champs titre et catégorie
  const titleLabel = document.createElement("label");
  titleLabel.setAttribute("for", "title");
  titleLabel.textContent = "Titre";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "title";
  titleInput.name = "title";

  const categoryLabel = document.createElement("label");
  categoryLabel.setAttribute("for", "category");
  categoryLabel.textContent = "Catégorie";

  const categorySelect = document.createElement("select");
  categorySelect.id = "category";
  categorySelect.name = "category";

  // fetch des catégories pour le select/dropdown
  const responseCategories = await fetch("http://localhost:5678/api/categories");
  const categories = await responseCategories.json();

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "";
  defaultOption.disabled = true; // option par défaut non sélectionnable
  defaultOption.selected = true; // option par défaut sélectionnée
  categorySelect.appendChild(defaultOption);

  categories.forEach (category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  const separator2 = document.createElement("div");
  separator2.classList.add("modal-separator");

  // message d'erreur pour les champs invalides
  const errorMessage = document.createElement("p");
  errorMessage.id = "form-error";
  errorMessage.textContent = "Veuillez remplir tous les champs.";
  errorMessage.classList.add("hidden");

  // Bouton valider désactivé par défaut
  const validateButton = document.createElement("button");
  validateButton.type = "submit";
  validateButton.id = "validate-photo";
  validateButton.textContent = "Valider";
  validateButton.disabled = true; // le bouton est désactivé tant que les champs ne sont pas remplis

  form.appendChild(uploadArea); // ajout de la zone d'upload au formulaire
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(categoryLabel);
  form.appendChild(categorySelect);
  form.appendChild(separator2);
  form.appendChild(errorMessage);
  form.appendChild(validateButton);

  addPhotoView.appendChild(backButton); // ajout du bouton de retour en haut de la page d'ajout pour une meilleure UX
  addPhotoView.appendChild(addPhotoTitle);
  addPhotoView.appendChild(form);

  modal.appendChild(closeButton); // la croix de fermeture est ajoutée en premier pour être au dessus des autres éléments
  modal.appendChild(galleryView);
  modal.appendChild(addPhotoView);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  createErrorAPI(); // création du message d'erreur pour l'appel API, il est caché par défaut et ne s'affichera que si la requête POST échoue

  return modalOverlay; // retourne l'overlay de la modal pour pouvoir le manipuler (afficher/masquer) dans initModal et les autres fonctions de modal.js
}



// Pop up confirmation de suppression d'un projet/travail
function deleteConfirmation(id) {

  const confirmationPopUp = document.createElement("div");
  confirmationPopUp.classList.add("delete-confirmation");

  const deleteBox = document.createElement("div");
  deleteBox.classList.add("delete-box");

  const message = document.createElement("p");
  message.textContent = "Supprimer ce projet ?";

  const deleteActions = document.createElement("div");
  deleteActions.classList.add("delete-actions");


  const confirmButton = document.createElement("button");
  confirmButton.id = "confirm-delete";
  confirmButton.textContent = "Supprimer";

  const cancelButton = document.createElement("button");
  cancelButton.id = "cancel-delete";
  cancelButton.textContent = "Annuler";

  deleteActions.appendChild(confirmButton);
  deleteActions.appendChild(cancelButton);
  deleteBox.appendChild(message);
  deleteBox.appendChild(deleteActions);
  confirmationPopUp.appendChild(deleteBox);
  document.body.appendChild(confirmationPopUp);

  cancelButton.addEventListener("click", () => {
    confirmationPopUp.remove();
  });

  confirmButton.addEventListener("click", async () => {
    await deleteWork(id);
    confirmationPopUp.remove();
  });
}

// fonction fetch delete d'un travail/projet
async function deleteWork(id) {

  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}` // token pour autorisation de suppression
    }
  });

  if (response.ok) {

    // suppression dans la galerie modal
    const modalGalleryFigure = document.querySelector(`#modal-gallery figure[data-id="${id}"]`);
    if (modalGalleryFigure) modalGalleryFigure.remove();

    // suppression dans la galerie principale
    const principalGalleryFigure = document.querySelector(`#works-gallery figure[data-id="${id}"]`);
    if (principalGalleryFigure) principalGalleryFigure.remove();

  } else {
    alert("La suppression a échoué");
  }

}

// erreur appel API, message d'erreur pop up
function createErrorAPI() {
  const errorPopUp = document.createElement("div");
  errorPopUp.classList.add("delete-confirmation"); // réutilisation du style de la pop up de confirmation pour l'erreur

  const errorBox = document.createElement("div");
  errorBox.classList.add("delete-box");

  const message = document.createElement("p");
  message.textContent = "Une erreur est survenue. Veuillez réessayer.";

  const closeButton = document.createElement("button");
  closeButton.id = "close-error";
  closeButton.textContent = "Fermer";
  closeButton.classList.add("close-error-btn");

  closeButton.addEventListener("click", () => {
    errorPopUp.remove();
  });

  errorBox.appendChild(message);
  errorBox.appendChild(closeButton);
  errorPopUp.appendChild(errorBox);
  document.body.appendChild(errorPopUp);
}

// bouton valider si tous les champs sont remplis
function checkFormValidity() {
    const fileInput = document.getElementById("image-upload");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const validateButton = document.getElementById("validate-photo");
    const titleFilled = titleInput.value.trim() !== ""; // les espaces ne comptent pas comme remplissage
    const categoryFilled = categorySelect.value !== "";
    const fileFilled = fileInput.files.length > 0;

    const isValid = titleFilled && categoryFilled && fileFilled;
    // const errorMessage = document.getElementById("form-error");


    validateButton.disabled = !isValid;
    // errorMessage.classList.toggle("hidden", isValid) ;

    return isValid;
}


async function validateForm(event) {
  event.preventDefault(); // empêche le rechargement de la page à la soumission du formulaire
  const errorMessage = document.getElementById("form-error");

  if (checkFormValidity()) {

    errorMessage.classList.toggle("hidden", true) ; // masque le message d'erreur si les champs sont valides
    const titleInput = event.target["title"].value;
    const categoryInput = event.target["category"].value;
    const fileInput = event.target["image"];



    //POST
    const tokenForm = localStorage.getItem("token");
    const formData = new FormData(); //données formulaire
    formData.append("image", event.target["image"].files[0]); // fichier img
    formData.append("title", event.target["title"].value); // titre
    formData.append("category", event.target["category"].value); // id category

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenForm}` }, // token pour autorisation
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
        displayModalWork(newWork);
        displayWork(newWork); // affiche le nouveau projet dans la galerie principale
      // // ajoute le nouveau projet aux 2 galeries
      // const newProject = document.createElement("figure");
      // newProject.dataset.id = newWork.id;

      // // création de l'élément img pour la nouvelle photo
      // const newImg = document.createElement("img");
      // newImg.src = newWork.imageUrl;
      // newImg.alt = newWork.title;
      // newProject.appendChild(newImg);

      //  // clone de la figure pour la galerie principale
      // const clone = newProject.cloneNode(true);
      // document.getElementById("modal-gallery").appendChild(newProject);
      // document.getElementById("works-gallery").appendChild(clone);

      // retour à la galerie après ajout
      document.getElementById("modal-add-photo").classList.add("hidden");
      document.getElementById("modal-gallery-view").classList.remove("hidden");

      // réinitialisation du formulaire et du bouton valider
      event.target.reset();
      const uploadArea = document.querySelector(".upload-area");
      uploadArea.innerHTML = "";
      uploadArea.replaceWith(createUploadImg()); // recréation de la zone d'upload pour réinitialiser l'input de type file et permettre un nouvel upload
      event.target["category"].value = ""; // réinitialisation du select

    } else {
      createErrorAPI(); // affiche le message d'erreur si la requête échoue
    }

  } else {
    errorMessage.classList.toggle("hidden", false) ; // affiche le message d'erreur si les champs ne sont pas valides
  }
}


// ajouter une photo avec sa preview, fetch catégories, bouton

function addNewProject() {

  const fileInput = document.getElementById("image-upload");
  const uploadArea = document.querySelector(".upload-area");


  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader(); // outil natif du navigateur
      reader.onload = (event) => {
        uploadArea.innerHTML = "";

        const previewImage = document.createElement("img");
        previewImage.src = event.target.result;
        previewImage.alt = "preview-image";

        // recliquer sur l'image
        previewImage.style.cursor = "pointer";
        previewImage.addEventListener("click", () => {
          fileInput.click();
        });
        uploadArea.appendChild(previewImage);
        uploadArea.appendChild(fileInput);
      };
      reader.readAsDataURL(file);
    }
  });

  const form = document.getElementById("add-photo-form");
  form.addEventListener("change", checkFormValidity);
  // titleInput.addEventListener("input", checkFormValidity);
  // categorySelect.addEventListener("change", checkFormValidity);
  // fileInput.addEventListener("change", checkFormValidity);

  // validation des extensions et poids avant envoie API et message d'erreur

  form.addEventListener("submit", validateForm);

}

function displayModalWork(work) {
  const modalGallery = document.getElementById("modal-gallery");
  const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-photo");

    const trashIcon = document.createElement("img");
    trashIcon.src = "./assets/icons/trash-can-solid.png";
    trashIcon.alt = "Supprimer";

    deleteButton.appendChild(trashIcon);

    figure.appendChild(img);
    figure.appendChild(deleteButton);

    modalGallery.appendChild(figure);

    deleteButton.addEventListener("click", () => {
      deleteConfirmation(work.id);
    });
}


// récupération des travaux depuis l'API déjà fetch dans script.js
function displayModalWorks(works) {
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  works.forEach((work) => { // pour chaque travail, création d'une figure avec l'image et le bouton de suppression
    displayModalWork(work);
  });
}




export async function initModal(works) { // fonction d'initialisation de la modal, appelée dans script.js après le fetch des travaux

  const modalOverlay = await createModal(); // création de la modal
  addNewProject(); // ajout de projet avec preview

  // vérification de la connexion
  const editButton = document.getElementById("edit-button");
  const closeButton = document.getElementById("modal-close");

  const addPhotoButton = document.getElementById("add-photo");
  const galleryView = document.getElementById("modal-gallery-view");
  const addPhotoView = document.getElementById("modal-add-photo");
  const backButton = document.getElementById("modal-back");


  // ouverture modal
  if (editButton) {
    editButton.addEventListener("click", () => {
      modalOverlay.classList.remove("hidden");
    });
  }

  // fermeture avec la croix
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modalOverlay.classList.add("hidden");
    });
  }

  // fermeture en cliquant sur l'overlay
  modalOverlay.addEventListener("click", (event) => {

    // si on clique sur le fond
    if (event.target === modalOverlay) {
      modalOverlay.classList.add("hidden");
    }

  });

  // aller vers ajout photo
  if (addPhotoButton) {
    addPhotoButton.addEventListener("click", () => {
      galleryView.classList.add("hidden");
      addPhotoView.classList.remove("hidden");
    });
  }

  // retour galerie
  if (backButton) {
    backButton.addEventListener("click", () => {
      addPhotoView.classList.add("hidden");
      galleryView.classList.remove("hidden");
    });
  }

  displayModalWorks(works); // affiche les travaux dans la modal après sa création et l'ajout des listeners
}
