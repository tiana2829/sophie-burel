// partie login form
document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    // Empêche la soumission du formulaire
    event.preventDefault();
    alert('coucou');

    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;

    console.log("la valeur de l'email", userEmail);
    const checkLoginForm = async () => {
      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          // Stocker le token dans le localStorage
          localStorage.setItem('authToken', data.token);
          document.getElementById('message').textContent = 'Connexion réussie!';
          // Redirection index
          window.location.href = 'index.html';
        } else {
          document.getElementById('message').textContent =
            'Erreur: ' + data.message;
        }
      } catch (error) {
        document.getElementById('message').textContent = 'Erreur de connexion';
      }
    };
    checkLoginForm();
  });
