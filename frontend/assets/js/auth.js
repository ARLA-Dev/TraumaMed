const token = sessionStorage.getItem('token');

if (!token) {
  
  // No hay un token, redirige al usuario a la página de inicio de sesión
  if (window.location.href.indexOf('login.html') === -1 && window.location.href.indexOf('recuperar_clave.html') === -1) {
    window.location.href = 'login.html';
  }

}else{
  if (window.location.href.indexOf('login.html') !== -1 || window.location.href.indexOf('recuperar_clave.html') !== -1) {
    window.location.href = 'index.html';
  }
}

function logout() {

  // Almacena el token en el sessionStorage
  sessionStorage.removeItem("token");

  // Redirige al usuario a la página deseada
  window.location.href = "login.html";

};
