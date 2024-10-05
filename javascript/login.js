document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:5678/api/users/login';
  const ERROR_MESSAGE = 'Identifiant ou mot de passe incorrects';
  const form = document.getElementById('loginForm');

  const displayError = (message) => {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.color = 'red';
    messageDiv.style.marginTop = '20px'; // Espace pour séparer du lien "Mot de passe oublié"
    // Faire disparaitre le message après 5 secondes
    setTimeout(() => {
      messageDiv.textContent = '';
    }, 5000);
  };

  /**
   * Tente de se connecter avec l'utilisateur en utilisant l'email et le mot de passe fournis.
   *
   * Cette fonction envoie une requête POST à l'URL de l'API spécifiée et,
   * si cela réussit, stocke le token reçu dans le stockage local et
   * redirige vers la page d'accueil. Si la tentative de connexion échoue,
   * elle enregistre l'erreur et affiche un message d'erreur.
   *
   * @param {string} email - L'adresse email de l'utilisateur.
   * @param {string} password - Le mot de passe de l'utilisateur.
   * @returns {Promise<void>} Une promesse qui se résout lorsque la tentative de connexion est terminée.
   */
  const login = async (email, password) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('data contient', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location = 'index.html';
      } else {
        console.error('Erreur de connexion');
        displayError(ERROR_MESSAGE);
      }
    } catch (error) {
      console.log(ERROR_MESSAGE, error);
      displayError(ERROR_MESSAGE);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Utilisation de la destructuration pour récupérer les champs
    const { email, password } = form;

    // Validation basique
    if (!email.value || !password.value) {
      displayError('Veuillez remplir tous les champs.');
      return;
    }

    // Désactiver le bouton pour éviter les soumissions multiples
    const submitButton = event.target.querySelector('input[type="submit"]');
    submitButton.disabled = true;

    // Appel de la fonction login avec réactivation du bouton par la suite
    login(email.value, password.value).finally(() => {
      // Réactivation du bouton de soumission après la tentative
      submitButton.disabled = false;
    });
  });
});
