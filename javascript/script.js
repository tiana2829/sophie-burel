//Variables globales

const galleryContainer = document.querySelector('.gallery');
const categoriesContainer = document.querySelector('.categories');

// tableau pour stocker les data
let everyWorks = [];

//Méthode qui retourne une balise figure img et figcaption

const createWorkFigure = (work) => {
  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.src = work.imageUrl;
  image.alt = work.title;
  figure.appendChild(image);
  const figcaption = document.createElement('figcaption');
  figcaption.innerHTML = work.title;
  figure.appendChild(figcaption);
  return figure;
};

//Méthode qui retourne toutes les données

const API = 'http://localhost:5678/api/works';
const fetchDataAndDisplay = async () => {
  try {
    const result = await fetch(`${API}`);
    const data = await result.json();
    console.log(data);
    everyWorks = data;
    displayWorks(everyWorks);
  } catch (error) {
    console.error(error);
  }
};

// Méthode qui construit les figures et affiche toutes les oeuvres

const displayWorks = (works) => {
  galleryContainer.innerHTML = '';
  works.forEach((work) => {
    const figure = createWorkFigure(work);
    galleryContainer.appendChild(figure);
  });
};
// appel de la fonction qui récupère et affiche les données
fetchDataAndDisplay();

//Méthode pour chercher les catégories de l'API
const API_CATEGORY = 'http://localhost:5678/api/categories';
const fetchCategories = async () => {
  try {
    const result = await fetch(`${API_CATEGORY}`);
    const categories = await result.json();

    //On ajoute le bouton "Tous"
    categories.unshift({
      id: 0,
      name: 'Tous',
    });
    console.log(categories);
    populateFilters(categories);
  } catch (error) {
    console.error(error);
  }
};

fetchCategories();

//Méthode pour créer un bouton qui contient une catégorie (filtre)
const populateFilters = (categories) => {
  //S'assurer que le container de categorie est vide
  categoriesContainer.innerHTML = '';
  categories.forEach((elementCategory) => {
    let button = createCategoryButton(elementCategory);
    categoriesContainer.appendChild(button);
    setUpFilter(button, elementCategory.id);
  });
};

const createCategoryButton = (elementCategory) => {
  let myButton = document.createElement('button');
  myButton.classList.add('filters-design', 'work-filter');
  if (elementCategory.id === 0) {
    myButton.classList.add('filter-all', 'filter-active');
  }
  myButton.setAttribute('data-filter', elementCategory.id);
  myButton.innerHTML = elementCategory.name;
  return myButton;
};

// Ajouter un gestionnaire d'événements au clic et appeler la méthode filterWorks
const setUpFilter = (button, categoryId) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveFilter(button);
    filterWorks(categoryId);
  });
};

//Pour gérer l'activation ou non avec le Style CSS
const setActiveFilter = (button) => {
  document.querySelectorAll('.work-filter').forEach((workFilter) => {
    workFilter.classList.remove('filter-active');
  });
  button.classList.add('filter-active');
};

// Méthode pour filtrer et afficher les oeuvres
const filterWorks = (categoryId) => {
  if (categoryId === 0) {
    // par défaut on affiche toutes les oeuvres
    displayWorks(everyWorks);
  } else {
    const filteredWorks = everyWorks.filter(
      (work) => work.categoryId === categoryId
    );
    // Affichage selon la catégorie séléctionnée
    displayWorks(filteredWorks);
  }
};
