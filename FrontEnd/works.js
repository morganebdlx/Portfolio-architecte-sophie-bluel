async function init () {

 const response = await

 //Récuopération des travaux via l'API

  fetch("http://localhost:5678/api/works");

  const works = await response.json();

  const worksGallery = document.getElementById("works-gallery");
  worksGallery.innerHTML = "";


  works.forEach(work => {

    const figure = document.createElement("figure");

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>`;

    worksGallery.appendChild(figure);
  });


  //Récupération des catégories via l'API

   fetch("http://localhost:5678/api/categories");

  const categorie = await response.json();

  const categoriesFilter = document.getElementById("works-gallery");
  categoriesFilter.innerHTML = "";


  works.forEach(work => {

    const figure = document.createElement("figure");

    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>`;

    categoriesFilter.appendChild(figure);
  });
}

init();
