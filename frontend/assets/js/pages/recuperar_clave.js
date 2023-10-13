const lupa = document.getElementById('lupa');
const segundoFormulario = document.querySelector('form.d-none');

lupa.addEventListener('click', function (event) {
  const username = document.getElementById('username').value;

  if (username.trim() === "" ) {
    Swal.fire(
      '¡Campo vacío!',
      'Por favor ingresa usuario',
      'warning'
    );
    return; // Detener la ejecución si hay campos vacíos
  }

  fetch('http://localhost:9090/api/usuarios/recuperar_clave/' + username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {

        if(!segundoFormulario.classList.contains("d-none")){segundoFormulario.classList.add('d-none');}

        Swal.fire(
          '¡Error!',
          'Usuario no encontrado',
          'error'
        )
      }
    })
    .then((data) => {
      const pregunta = data.pregunta; // Obtener la pregunta de seguridad de la respuesta JSON

      // Colocar la pregunta en el campo de entrada del segundo formulario
      document.getElementById('pregunta').value = pregunta;

      // Quitar la clase d-none del segundo formulario
      segundoFormulario.classList.remove('d-none');
    })
    .catch((error) => {
      console.error(error);
    });
});

const recuperar_btn = document.getElementById('recuperar_btn');

recuperar_btn.addEventListener('click', function (event) {
  const username = document.getElementById('username').value;
  const respuesta = document.getElementById('respuesta').value;
  const nuevaClave = document.getElementById('password').value;

  if (username.trim() === "" || respuesta.trim() === "" || nuevaClave.trim() === "") {
    Swal.fire(
      '¡Campos vacíos!',
      'Por favor ingrese todos los campos',
      'warning'
    );
    return; // Detener la ejecución si hay campos vacíos
  }

  fetch('http://localhost:9090/api/usuarios/recuperar_clave/' + username, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      respuesta,
      nuevaClave,
    }),
    mode: 'cors', // Agrega este encabezado
  })
    .then((response) => {

      if (response.ok) {
        Swal.fire(
          '¡Exito!',
          'Se ha cambiado la contraseña',
          'success'
        ).then(() => {
          window.location.href = "login.html";
        })
      } 

      else {
        Swal.fire(
          '¡Error!',
          'Respuesta de seguridad incorrecta',
          'error'
        )
      }
    })
    .catch((error) => {
      console.error(error);
    });
});




