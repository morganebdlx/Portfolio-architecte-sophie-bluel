import { initModal } from "./modal.js";
let works = null;


//// Fonction affichage travaux

export function displayWork (work){
  const worksGallery = document.getElementById("works-gallery");
  const figure = document.createElement("figure");
  figure.dataset.id = work.id;

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(caption);

    worksGallery.appendChild(figure);
}

//// Fonction affichage admin

function displayAdminMode() {

  const apiToken = localStorage.getItem("token");

  const header = document.querySelector("header");
  const filterButtons = document.getElementById("filter-buttons");
  const loginLink = document.getElementById("login");
  const portfolioSection = document.getElementById("portfolio");

  if (apiToken) { // connecté

    // Bandeau admin
    if (header) {
      const adminMode = document.createElement("div");
      adminMode.id = "admin-mode";
      adminMode.innerHTML = `
        <img src="./assets/icons/edition-mode.png" alt="edit icon">
        <span>Mode édition</span>
      `;
      header.appendChild(adminMode);
    }

    // cacher filtres
    if (filterButtons) {
      filterButtons.classList.add("hidden");
    }

    // login / logout
    if (loginLink) {
      loginLink.textContent = "logout";
      loginLink.href = "#";

      loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }

    // bouton modifier
    if (portfolioSection) {
      const editButton = document.createElement("button");

      editButton.id = "edit-button";
      editButton.innerHTML = `
        <img src="./assets/icons/edition-mode-black.png" alt="edit icon">
        Modifier
      `;

      portfolioSection.prepend(editButton);
    }

    // init modal
    initModal(works);

  } else { // non connecté

    if (filterButtons) {
      filterButtons.classList.remove("hidden");
    }

    const editButton = document.getElementById("edit-button");

    if (editButton) {
      editButton.style.display = "none";
    }
  }

}


async function init () {

 const apiToken = localStorage.getItem("token");

////////////// Gallery page ///////////////

 const responseWorks = await fetch("http://localhost:5678/api/works");

// Récuopération des travaux via l'API

  works = await responseWorks.json();
  const worksGallery = document.getElementById("works-gallery");
  worksGallery.innerHTML = "";


  works.forEach(work => {
    displayWork(work);
  });


// Récupération des catégories via l'API que lorsque l'admin n'est pas connecté
  if (!apiToken) {
    const responseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await responseCategories.json();
    const categoriesFilter = document.getElementById("filter-buttons");
    categoriesFilter.innerHTML = "";


  // Ajout des boutons de filtres
  // On recré le tableau afin d'y ajouter le "Tous" pour avoir une boucle avec tous les éléments
    [{id:-1, name:"Tous"},...categories].forEach(categorie => {

      // Ajout des boutons via API
      const button = document.createElement("button");

      button.textContent = categorie.name;
      button.setAttribute("data-category", categorie.id);

      if (categorie.id === -1) {
        button.classList.add("active");
      }

      categoriesFilter.appendChild(button);


      // Au clic sur un élément du menu de catégories, les travaux sont triés selon le filtre sélectionné.

        button.addEventListener("click", () => {

          const selectedCategory = button.getAttribute("data-category");

          document.querySelectorAll("#filter-buttons button").forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");


          //si tous est sélectionné alors on affiche tous kes travaux sinon on filtre selon l'id de la catégorie
          if (selectedCategory === "-1") {
            worksGallery.innerHTML = ""; //permet de vider le HTML pour mettre le bon contenu par la suite
            works.forEach(work => {
              displayWork(work);
            });

          } else {
            worksGallery.innerHTML = "";
            works.forEach(work => {

              if (work.categoryId == selectedCategory) { //permet d'afficher uniquement les works de la categorie sélectionnée
                displayWork(work);
              }
            }
          );
        };
      });
    });
  }
    //////////// Admin Mode ///////////////
    /// apparition du bandeau au login, login to logout, no filters

  displayAdminMode();
}
init();
