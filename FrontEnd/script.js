async function init () {

////////////// Gallery page ///////////////

 const responseWorks = await fetch("http://localhost:5678/api/works");

// Récuopération des travaux via l'API

  const works = await responseWorks.json();
  const worksGallery = document.getElementById("works-gallery");
  worksGallery.innerHTML = "";


  works.forEach(work => {

    const figure = document.createElement("figure");

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>`;
    worksGallery.appendChild(figure);
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

            const figure = document.createElement("figure");

            figure.innerHTML = `
              <img src="${work.imageUrl}" alt="${work.title}">
              <figcaption>${work.title}</figcaption>`;
            worksGallery.appendChild(figure);
          });

        } else {
          worksGallery.innerHTML = "";
          works.forEach(work => {

            if (work.categoryId == selectedCategory) { //permet d'afficher uniquement les works de la categorie sélectionnée

              const figure = document.createElement("figure");

              figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>`;
              worksGallery.appendChild(figure);
            }
          }
        );
      };
    });
  });



  /////////////////// Login page ///////////////////

  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-name").value;
    const password = document.getElementById("password").value;

  // Récupération login via API
    const responseLoginForm = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (responseLoginForm.ok) {
      const data = await responseLoginForm.json();
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      loginError.style.display = "block";
      loginError.textContent = "Erreur dans l'e-mail ou le mot de passe";
    }
  });
}
init();
