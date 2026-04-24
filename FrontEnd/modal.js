// import de la fonction d'affichage d'un travail dans la galerie principale pour pouvoir l'appeler après l'ajout d'un nouveau projet et l'afficher directement dans la galerie sans recharger la page
import { displayWork } from "./script.js";


///////////// Création de la modal en JS ///////////////
////// creation de la partie ajout photo pour la réutiliser dans le POST
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

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0]; // récupération du fichier sélectionné

    if (file) {
      const reader = new FileReader(); // outil natif du navigateur pour lire les fichiers
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
      reader.readAsDataURL(file); // lit le contenu du fichier et déclenche l'événement onload lorsque la lecture est terminée
    }
  });

  uploadArea.appendChild(uploadImg); // image d'upload
  uploadArea.appendChild(uploadLabel); // le label est ajouté après l'image pour être au dessus de celle ci et permettre de cliquer dessus pour ouvrir la fenêtre d'upload
  uploadArea.appendChild(fileInput); // l'input de type file est ajouté après le label pour être au dessus du label et permettre de cliquer dessus pour ouvrir la fenêtre d'upload, il est invisible grâce au CSS et c'est le label qui sert de bouton d'upload
  uploadArea.appendChild(uploadHint); // le message d'aide est ajouté en dernier pour être en bas de la zone d'upload, après l'image et le label

 return uploadArea;
}


///////////// création de la structure HTML  du reste de la modal en JS ///////////////
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
  galleryView.appendChild(modalGallery); // la galerie est ajoutée avant les travaux pour éviter les problèmes de structure HTML et de style, les travaux seront ajoutés à l'intérieur de cette div dans displayModalWorks()
  galleryView.appendChild(separator1); // séparateur entre la galerie et le bouton d'ajout
  galleryView.appendChild(addPhotoButton); // le bouton d'ajout est ajouté en dernier pour être en bas de la modal, après la galerie et le séparateur

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

  //// Fonction appelée pour créer le formulaire d'ajout de photo
  const uploadArea = createUploadImg();


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
  validateButton.type = "submit"; // type submit pour le formulaire
  validateButton.id = "validate-photo";
  validateButton.textContent = "Valider";
  validateButton.disabled = true; // le bouton est désactivé tant que les champs ne sont pas remplis

  form.appendChild(uploadArea); // ajout de la zone d'upload au formulaire
  form.appendChild(titleLabel); // ajout du label titre
  form.appendChild(titleInput); // ajout de l'input titre
  form.appendChild(categoryLabel); // ajout du label catégorie
  form.appendChild(categorySelect); // ajout du select catégorie
  form.appendChild(separator2); // séparateur entre les champs du formulaire et le bouton de validation
  form.appendChild(errorMessage); // ajout du message d'erreur avant le bouton de validation pour qu'il soit au dessus de celui ci et visible en cas d'erreur
  form.appendChild(validateButton); // ajout du bouton de validation à la fin du formulaire pour qu'il soit en bas, après les champs et le message d'erreur

  addPhotoView.appendChild(backButton); // ajout du bouton de retour en haut de la page d'ajout pour une meilleure UX
  addPhotoView.appendChild(addPhotoTitle); // ajout du titre de la page d'ajout avant le formulaire pour éviter les problèmes de structure HTML et de style
  addPhotoView.appendChild(form); // ajout du formulaire après le titre pour éviter les problèmes de structure HTML et de style, les champs du formulaire seront à l'intérieur de ce form et le bouton de validation permettra de soumettre ce form

  modal.appendChild(closeButton); // la croix de fermeture est ajoutée en premier pour être au dessus des autres éléments
  modal.appendChild(galleryView); // la vue galerie est ajoutée avant la vue d'ajout pour être la page d'accueil de la modal, c'est la première chose que l'on voit en ouvrant la modal
  modal.appendChild(addPhotoView); // la vue d'ajout est ajoutée en dernier pour être cachée par défaut, elle ne s'affichera que lorsque l'on cliquera sur le bouton d'ajout et que la vue galerie sera cachée
  modalOverlay.appendChild(modal); // la modal est ajoutée à l'overlay pour que tout le contenu de la modal soit à l'intérieur de cet overlay, cela permettra de gérer l'affichage et la fermeture de la modal en manipulant cet overlay
  document.body.appendChild(modalOverlay); // la modal est ajoutée au body pour qu'elle soit à l'extérieur de toute autre structure HTML, cela permettra de gérer l'affichage et la fermeture de la modal plus facilement en manipulant cet élément


  return modalOverlay; // retourne l'overlay de la modal pour pouvoir le manipuler (afficher/masquer) dans initModal et les autres fonctions de modal.js
}



/////////////// Pop up confirmation de suppression d'un projet/travail en JS /////////////

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



/////////// fonction fetch DELETE d'un travail/projet //////////////
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
    createErrorAPI();
  }

}



////////// erreur appel API, message d'erreur pop up en JS /////////////

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



////////////// bouton valider actif si tous les champs sont remplis ///////////////
function checkFormValidity() {
    const fileInput = document.getElementById("image-upload");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("category");
    const validateButton = document.getElementById("validate-photo");
    const titleFilled = titleInput.value.trim() !== ""; // les espaces ne comptent pas comme remplissage
    const categoryFilled = categorySelect.value !== "";
    const fileFilled = fileInput.files.length > 0;
    const isValid = titleFilled && categoryFilled && fileFilled; // tous les champs doivent être remplis pour que le formulaire soit valide
    // le bouton de validation est activé ou désactivé en fonction de la validité du formulaire
    validateButton.disabled = !isValid;
    return isValid;
}


//////////// validation du formulaire d'ajout photo et POST ////////////////

async function validateForm(event) {
  event.preventDefault(); // empêche le rechargement de la page à la soumission du formulaire
  const errorMessage = document.getElementById("form-error");

  if (checkFormValidity()) { // si le formulaire est valide, on peut envoyer la requête POST
    errorMessage.classList.toggle("hidden", true) ; // masque le message d'erreur si les champs sont valides
    const titleInput = event.target["title"].value;
    const categoryInput = event.target["category"].value;
    const fileInput = event.target["image"];

    /// POST
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


/////////// ajouter une photo avec sa preview, fetch catégories, bouton ////////////

function addNewProject() {

  const form = document.getElementById("add-photo-form");
  form.addEventListener("change", checkFormValidity); // vérifie la validité du formulaire à chaque changement dans les champs pour activer/désactiver le bouton de validation
  form.addEventListener("submit", validateForm); // écoute la soumission du formulaire pour valider les données et envoyer la requête POST
}


//////// afffichage des nouveaux travaux dans la modal et gelerie prinicpale en JS//////////

function displayModalWork(work) {
  // création de la figure pour la modal
  const modalGallery = document.getElementById("modal-gallery");
  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  // création de l'image et du bouton de suppression pour la modal
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

  // ajout de l'écouteur d'événement pour le bouton de suppression
  deleteButton.addEventListener("click", () => {
    deleteConfirmation(work.id);
  });
}


///////// récupération des travaux depuis l'API déjà fetch dans script.js ///////////

function displayModalWorks(works) {
  const modalGallery = document.getElementById("modal-gallery");
  modalGallery.innerHTML = "";

  works.forEach((work) => { // pour chaque travail, création d'une figure avec l'image et le bouton de suppression
    displayModalWork(work);
  });
}


//////// fonction d'initalisation de la modal //////////

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
