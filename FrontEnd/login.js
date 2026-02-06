async function init () {

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
