let login_btn = document.getElementById("login_btn");

login_btn.addEventListener("click", async function (event) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username.trim() === "" || password.trim() === "") {
    Swal.fire(
      '¡Campos vacíos!',
      'Por favor ingresa usuario y contraseña',
      'warning'
    );
    return; // Detener la ejecución si hay campos vacíos
  }

  try {
    const response = await fetch("http://localhost:9090/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      if (token) {
        sessionStorage.setItem("token", token);
        const nombre = await obtenerNombre(token);
        sessionStorage.setItem("nombre", nombre);

        window.location.href = "index.html";
      } else {
        console.error("No se encontró el token en la respuesta");
      }
    } else {
      Swal.fire(
        '¡Error!',
        'Usuario o contraseña incorrectos',
        'error'
      )
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

async function obtenerNombre(token) {
  try {
    const response = await fetch('http://localhost:9090/api/usuarios/current', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener el usuario actual');
    }

    const data = await response.json();
    return data.nombre;
  } catch (error) {
    console.error('Error:', error);
    return "Yuleima Pérez";
  }
}



