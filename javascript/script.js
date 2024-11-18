const GALLERY_CONTAINER = document.querySelector('.gallery');
const CATEGORIES_CONTAINER = document.querySelector('.categories');
const LOGIN_LINK = document.querySelector('#login-link');
const MODIFY_BUTTON = document.querySelector('.modifyButton');
const MAIN_MODAL = document.querySelector('#mainModal');
const SECOND_MODAL = document.querySelector('#secondModal');
const WORKS_WITH_ICON_TRASH = document.querySelector('.worksWithIconTrash');
const ADDPICTURE = document.querySelector('.addPicture');
const FORM_MODAL = document.querySelector('#formModal');
const fileInput = document.querySelector('#fileUpload');
const imgPreview = document.querySelector('#imagePreview');
const addPhotoButton = document.querySelector('.addPhoto');
const iconPreview = document.querySelector('#iconPreview');
const extensions = document.querySelector('.extensions');
const API_WORKS = 'http://localhost:5678/api/works';
const API_CATEGORIES = 'http://localhost:5678/api/categories';

// Tableau pour stocker les data
let allWorks = [];
let allCategories = [];

/**
 * Crée une balise figure contenant une image et une caption pour un travail donné.
 * @param {Object} work - Le travail à afficher.
 * @returns {HTMLElement} La balise figure créée.
 */
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

/**
 * Récupère de manière asynchrone les œuvres et les catégories depuis les API respectives, traite les données et met à jour l'interface utilisateur.
 * La fonction effectue les étapes suivantes :
 *
 * 1. Récupère les données de `API_WORKS` et `API_CATEGORIES` en parallèle.
 * 2. Analyse les réponses JSON pour les œuvres et les catégories.
 * 3. Ajoute une catégorie par défaut 'Tous' au début de la liste des catégories.
 * 4. Met à jour l'interface utilisateur en appelant `displayWorks` avec toutes les œuvres et `populateFilters` avec les catégories mises à jour.
 * 5. Enregistre les erreurs rencontrées lors des opérations de récupération dans la console.
 */
const fetchWorksAndCategories = async () => {
  try {
    const [worksResponse, categoriesResponse] = await Promise.all([
      fetch(API_WORKS),
      fetch(API_CATEGORIES),
    ]);

    allWorks = await worksResponse.json();
    const categories = await categoriesResponse.json();

    allCategories = categories;
    categories.unshift({ id: 0, name: 'Tous' });
    displayWorks(allWorks);
    populateFilters(categories);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Affiche les travaux dans la galerie.
 * @param {Array} works - La liste des travaux à afficher.
 */
const displayWorks = (works) => {
  GALLERY_CONTAINER.innerHTML = '';
  works.forEach((work) => {
    const figure = createWorkFigure(work);
    GALLERY_CONTAINER.appendChild(figure);
  });
};

/**
 * Ajoute des boutons de filtre pour les catégories.
 * @param {Array} categories - La liste des catégories.
 */
const populateFilters = (categories) => {
  CATEGORIES_CONTAINER.innerHTML = '';
  categories.forEach((category) => {
    let button = createCategoryButton(category);
    CATEGORIES_CONTAINER.appendChild(button);
    setUpFilter(button, category.id);
  });
};

/**
 * Crée un bouton pour une catégorie donnée.
 * @param {Object} category - La catégorie à afficher.
 * @returns {HTMLElement} Le bouton créé.
 */
const createCategoryButton = (category) => {
  let button = document.createElement('button');
  button.classList.add('filters-design', 'work-filter');
  if (category.id === 0) {
    button.classList.add('filter-all', 'filter-active');
  }
  button.setAttribute('data-filter', category.id);
  button.innerHTML = category.name;
  return button;
};

/**
 * Configure le filtre pour un bouton donné.
 * @param {HTMLElement} button - Le bouton à configurer.
 * @param {number} categoryId - L'ID de la catégorie.
 */
const setUpFilter = (button, categoryId) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    setActiveFilter(button);
    filterWorks(categoryId);
  });
};

/**
 * Style le bouton actif.
 * @param {HTMLElement} button - Le bouton à styliser.
 */
const setActiveFilter = (button) => {
  document.querySelectorAll('.work-filter').forEach((workFilter) => {
    workFilter.classList.remove('filter-active');
  });
  button.classList.add('filter-active');
};

/**
 * Filtre et affiche les travaux en fonction de la catégorie sélectionnée.
 * @param {number} categoryId - L'ID de la catégorie à filtrer.
 */
const filterWorks = (categoryId) => {
  const filteredWorks =
    categoryId === 0
      ? allWorks
      : allWorks.filter((work) => work.categoryId === categoryId);
  displayWorks(filteredWorks);
};

/**
 * Vérifie si l'utilisateur est connecté et met à jour l'UI.
 * @returns {boolean} true si l'utilisateur est connecté, false sinon.
 */
const checkUserStatus = () => {
  const token = localStorage.getItem('token');
  const isConnected = !!token;
  LOGIN_LINK.innerHTML = isConnected ? 'logout' : 'login';
  CATEGORIES_CONTAINER.style.display = isConnected ? 'none' : 'flex';
  MODIFY_BUTTON.style.visibility = isConnected ? 'visible' : 'hidden';
  const banner = document.createElement('div');
  banner.classList.add('banner');
  banner.innerHTML = isConnected
    ? '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>'
    : '';
  document.body.insertBefore(banner, document.body.firstChild);
  banner.style.display = isConnected ? 'flex' : 'none';
  return isConnected;
};

const handleLoginClick = () => {
  if (checkUserStatus()) {
    localStorage.removeItem('token');
    checkUserStatus();
    window.location.href = 'index.html';
  } else {
    window.location.href = 'login.html';
  }
};

LOGIN_LINK.addEventListener('click', handleLoginClick);

// Initiales appels fonctions
fetchWorksAndCategories();
checkUserStatus();

// //Fonction pour récupérer les images de l'API et y mettre le logo poubelle
// let trash = [];
// let snaps = [];
// const populateMainModal = async () => {
//   try {
//     const works = await fetch(API_WORKS); // récupération des données depuis l'API
//     let worksData = await works.json();
//     WORKS_WITH_ICON_TRASH.innerHTML = '';
//     worksData.forEach((workData) => {
//       let img = document.createElement('img');
//       img.src = workData.imageUrl;
//       snaps[workData.id] = document.createElement('figure');
//       snaps[workData.id].appendChild(img);
//       trash[workData.id] = document.createElement('i');
//       trash[workData.id].classList.add('fa-solid', 'fa-trash-can', 'trash');
//       snaps[workData.id].appendChild(trash[workData.id]);
//       WORKS_WITH_ICON_TRASH.appendChild(snaps[workData.id]);
//       let url = `http://localhost:5678/api/works/${workData.id}`;

//       trash[workData.id].addEventListener('click', () => {
//         deleteWork(url);
//         MAIN_MODAL.style.display = 'none';
//       });
//     });
//   } catch (error) {
//     console.error('error fetching work', error);
//     throw new Error('Error fetching work data', error);
//   }
// };

//Fonction pour récupérer les images de l'API et y mettre le logo poubelle
let trash = [];
let snaps = [];
const populateMainModal = async () => {
  try {
    const worksData = await fetch(API_WORKS).then((res) => res.json());
    WORKS_WITH_ICON_TRASH.innerHTML = '';

    worksData.forEach((workData) => {
      const figure = createWorkFigureWithTrash(workData);
      WORKS_WITH_ICON_TRASH.appendChild(figure);
    });
  } catch (error) {
    console.error('Error fetching works', error);
  }
};

const createWorkFigureWithTrash = (workData) => {
  const figure = createWorkFigure(workData);
  const trashIcon = document.createElement('i');
  trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
  figure.appendChild(trashIcon);

  trashIcon.addEventListener('click', () => {
    deleteWork(`http://localhost:5678/api/works/${workData.id}`);
    MAIN_MODAL.style.display = 'none';
  });

  return figure;
};

const deleteWork = async (url) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("vous n'êtes pas connectés");
    return;
  }
  const confirmation = confirm('êtes vous sûr de vouloir supprimer ce work');
  if (!confirmation) return;
  try {
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token} `,
      },
    });
    if (!response.ok) {
      return Promise.reject(new Error(`error http ${response.status}`));
    }
    console.log('work deleted');
  } catch (error) {
    console.error('error deleting work', error);
  }

  GALLERY_CONTAINER.innerHTML = '';
  // il faut raffraichir la gallerie
  //displayWorks(works);
  await populateMainModal();
  MAIN_MODAL.style.display = 'none';
};
//On ouvre la première modal
MODIFY_BUTTON.addEventListener('click', async () => {
  MAIN_MODAL.style.display = 'flex';
  await populateMainModal();
});
//On ouvre la seconde modale
// ADDPICTURE.addEventListener('click', async () => {
//   SECOND_MODAL.style.display = 'flex';
//   //on cache le premier modale
//   MAIN_MODAL.style.display = 'none';
// });

//On ouvre la seconde modale
/*ADDPICTURE.addEventListener('click', async () => {
  SECOND_MODAL.style.display = 'flex';
  MAIN_MODAL.style.display = 'none';

  try {
    const [worksData, categoriesData] = await Promise.all([
      fetchWorks(),
      fetchCategories(),
    ]);
    populateWorks(worksData);
    populateCategories(categoriesData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données', error);
  }
});

const fetchWorks = async () => {
  const response = await fetch(API_WORKS);
  return response.json();
};

const fetchCategories = async () => {
  const response = await fetch(API_CATEGORIES);
  return response.json();
};

const populateWorks = (worksData) => {
  WORKS_WITH_ICON_TRASH.innerHTML = '';
  worksData.forEach((workData) =>
    WORKS_WITH_ICON_TRASH.appendChild(createWorkFigureWithTrash(workData))
  );
};

const populateCategories = (categoriesData) => {
  const categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';
  categoriesData.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.text = category.name;
    categorySelect.appendChild(option);
  });
};

FORM_MODAL.addEventListener('submit', async (event) => {
  event.preventDefault();
  const imageInput = document.getElementById('fileUpload');
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');

  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('title', titleInput.value);
  formData.append('categoryId', categorySelect.value);

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(API_WORKS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Log the response to check what is returned
    const newWork = await response.json();
    console.log('New work added:', newWork);

    // add picture to gallery
    await fetchWorksAndCategories();
    alert('picture added');
    //SECOND_MODAL.style.display = "none"; // Close the modal
  } catch (error) {
    console.error('Error adding picture:', error);
  }
});*/

// Événement pour l'ouverture de la modal sans appel API
ADDPICTURE.addEventListener('click', () => {
  openSecondModal();
  selectCategories();
});
// Fonction pour gérer l'ouverture de la modal
const openSecondModal = () => {
  SECOND_MODAL.style.display = 'flex';
  MAIN_MODAL.style.display = 'none';
};

// Fonction pour afficher les catégories dans le select
const selectCategories = () => {
  let categorySelect = document.getElementById('category');
  categorySelect.innerHTML = '';
  const option = document.createElement('option');
  option.value = '';
  option.innerHTML = '';
  categorySelect.appendChild(option);
  console.log('toutes les catégories sont',allCategories)
const allCategoriesWithoutTous = allCategories.filter((cat)=>cat.id != 0)
  allCategoriesWithoutTous.forEach((category) => {
    const option = document.createElement('option');
    option.id = category.id;
    option.value = category.name;
    option.innerHTML = category.name;
    categorySelect.appendChild(option);
  });
};
