$(document).ready(function() {

    $("#show_hide_respuesta a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_respuesta input').attr("type") == "text"){
            $('#show_hide_respuesta input').attr('type', 'password');
            $('#show_hide_respuesta i').addClass( "fa-eye-slash" );
            $('#show_hide_respuesta i').removeClass( "fa-eye" );
        }else if($('#show_hide_respuesta input').attr("type") == "password"){
            $('#show_hide_respuesta input').attr('type', 'text');
            $('#show_hide_respuesta i').removeClass( "fa-eye-slash" );
            $('#show_hide_respuesta i').addClass( "fa-eye" );
        }
    });

});

const i_usuario = document.getElementById("i_usuario");
const i_nombre = document.getElementById("i_nombre");
const selectElement = document.getElementById('s_pregunta');


fetch('http://localhost:9090/api/usuarios/current', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener el usuario actual');
    }
    return response.json();
  })
  .then(data => {
    const { username, nombre, pregunta } = data;
    i_usuario.value = username;
    i_nombre.value = nombre;

    const optionElement = Array.from(selectElement.options).find(option => option.textContent === pregunta);
    if (optionElement) {
      selectElement.selectedIndex = optionElement.index;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

  const btnGuardar = document.getElementById("btnGuardar")

  btnGuardar.addEventListener("click", function() {
    const pregunta = selectElement.value;
    const respuesta = document.getElementById("respuesta").value;
    const password_old = document.getElementById("o_pass").value;
    const password_new = document.getElementById('n_pass').value;
    const useOldPassword = document.getElementById('ck').checked;
  
    // Verificar si se debe utilizar la contraseña antigua o la nueva contraseña
    const password = useOldPassword ? password_new : password_old;
  
    // Verificar si algún campo está vacío
    if (respuesta.trim() === "" || password.trim() === "" || password_old.trim() === "") {
      Swal.fire(
        '¡Campos vacíos!',
        'Por favor completa todos los campos.',
        'warning'
      );
      return; // Detener la ejecución si hay campos vacíos
    }
  
    fetch('http://localhost:9090/api/usuarios/current', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        password_old,
        pregunta,
        respuesta,
        password
      }),
      mode: 'cors', // Agrega este encabezado
    })
    .then((response) => {
      if (response.ok) {
        Swal.fire(
          '¡Éxito!',
          'Usuario modificado correctamente.',
          'success'
        );
      } else {
        throw new Error('Error en la solicitud');
      }
    })
    .catch((error) => {
      console.error(error);
      Swal.fire(
        '¡Error!',
        'Error al modificar el usuario.',
        'error'
      );
    });
  });
  
  

  