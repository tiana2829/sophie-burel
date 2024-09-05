//Variables globales

const galleryContainer = document.querySelector('.gallery');
const categoriesContainer = document.querySelector('.categories');
//Méthode qui retourne une balise figure img et figcaption

const creatWorkFigure = (work) => {
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
    // Itérer sur les données et créer les figures
    data.map((work) => {
      const figure = creatWorkFigure(work);
      galleryContainer.appendChild(figure);
    });
  } catch (error) {
    console.error(error);
  }
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
  categoriesContainer.innerHTML = ''; //Que le container de categorie est vide
  categories.forEach((elementCategory) => {
    let button = createCategoryButton(elementCategory);
    categoriesContainer.appendChild(button);
  });
};

const createCategoryButton = (elementCategory) => {
  let myButton = document.createElement('button');
  myButton.classList.add('filters-design');
  if (elementCategory.id === 0) {
    myButton.classList.add('filter-all', 'filter-active');
  }
  myButton.setAttribute('data-filter', elementCategory.id);
  myButton.innerHTML = elementCategory.name;
  return myButton;
};
