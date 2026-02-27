function displayWork (work){
  const worksGallery = document.getElementById("works-gallery");
  const figure = document.createElement("figure");

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>`;
    worksGallery.appendChild(figure);
}


async function init () {

////////////// Gallery page ///////////////

 const responseWorks = await fetch("http://localhost:5678/api/works");

// Récuopération des travaux via l'API

  const works = await responseWorks.json();
  const worksGallery = document.getElementById("works-gallery");
  worksGallery.innerHTML = "";


  works.forEach(work => {
    displayWork(work);
  });


// Récupération des catégories via l'API

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

    //////////// Admin Mode ///////////////


    /// apparition du bandeau au login, login to logout, no filters

  const apiToken = localStorage.getItem("token");

  if (apiToken) { // connecté
    const header = document.querySelector("header");
    const filterButtons = document.getElementById("filter-buttons");
    const loginLink = document.getElementById("login");
    const portfolioSection = document.getElementById("portfolio");


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

    // Filtres cachés
    if (filterButtons) {
      filterButtons.classList.add("hidden");
    }

    // login/logout
    if (loginLink) {
      loginLink.textContent = "logout";
      loginLink.href = "#";

      loginLink.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      });
    }

    // création du bouton modifier
    if (portfolioSection) {
      const editButton = document.createElement("button");

      editButton.id = "edit-button";
      editButton.innerHTML = `
        <img src="./assets/icons/edition-mode-black.png" alt="edit icon">
        Modifier
      `;
      portfolioSection.prepend(editButton, portfolioSection.firstChild);
    }

  } else { // non connecté
    const filterButtons = document.getElementById("filter-buttons");
    const editButton = document.getElementById("edit-button");

    if (filterButtons) {
      filterButtons.classList.remove("hidden");
    }

    if (editButton) {
      editButton.style.display = "none";
    }
  }
}
init();
