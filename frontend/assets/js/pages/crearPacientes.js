// Obtén una referencia al botón de guardar
const guardarBtn = document.querySelector('#btn_guardar');
const fechaHoy = new Date().toISOString().split('T')[0];
document.getElementById('i_fnac').max = fechaHoy;


function sumarUnDia(fecha) {
  const date = new Date(fecha);
  date.setDate(date.getDate() + 1); // Sumar un día
  return date.toISOString().split('T')[0];
}


// Agrega un event listener al botón de guardar
guardarBtn.addEventListener('click', async function(event) {
  // Obtén los valores de los campos del formulario
  const cedula = document.getElementById('i_cedula').value;
  let fechaNacimiento = document.getElementById('i_fnac').value;
  fechaNacimiento = sumarUnDia(fechaNacimiento);
  const nombre = document.getElementById('i_nombre').value.toUpperCase();
  const apellido = document.getElementById('i_apellido').value.toUpperCase();
  const nacionalidad = document.getElementById('s_nacionalidad').value;
  const lugarNacimiento = document.getElementById('i_lnac').value.toUpperCase();
  const direccion = document.getElementById('i_direccion').value.toUpperCase();
  const telefono = document.getElementById('i_telefono').value;
  let email = document.getElementById('i_email').value.toUpperCase();
  const estadoCivil = document.getElementById('s_edocivil').value;
  const antecedentes = document.getElementById('ta_antecedentes').value.toUpperCase();
  const sexo = 'Femenino';

  // Verificar si algún campo está vacío
  if (
    cedula.trim() === '' ||
    fechaNacimiento.trim() === '' ||
    nombre.trim() === '' ||
    apellido.trim() === '' ||
    nacionalidad.trim() === '' ||
    lugarNacimiento.trim() === '' ||
    direccion.trim() === '' ||
    telefono.trim() === '' ||
    estadoCivil.trim() === '' ||
    antecedentes.trim() === ''
  ) {
    Swal.fire(
      '¡Campos vacíos!',
      'Por favor completa todos los campos.',
      'warning'
    );
    return; // Detener la ejecución si hay campos vacíos
  }

  if (!/^\d{1,15}$/.test(cedula)) {
    Swal.fire(
      '¡Cédula inválida!',
      'La cédula debe contener solo números y tener 15 caracteres o menos.',
      'warning'
    );
    return;
  }

  if (fechaNacimiento > fechaHoy) {
    Swal.fire(
      '¡Fecha de nacimiento inválida!',
      'Estás intentando ingresar una fecha futura.',
      'warning'
    );
    return;
  }

  const nombreCompleto = nombre + apellido;

  if (nombreCompleto.length > 255 || lugarNacimiento.length > 255 || direccion.length > 255) {
    Swal.fire(
      '¡Texto demasiado largo!',
      'Los campos de nombre, apellido, lugar de nacimiento y dirección no pueden exceder los 255 caracteres.',
      'warning'
    );
    return;
  }

  if (email.trim() !== '') {
    if (email.indexOf('@') === -1 || email.indexOf('@') !== email.lastIndexOf('@') || email.length > 255) {
      Swal.fire(
        '¡Correo electrónico inválido!',
        'El correo electrónico debe contener un "@" y tener un máximo de 255 caracteres.',
        'warning'
      );
      return;
    }
  }

  if (telefono.length > 15 || !/^(\+)?\d+$/.test(telefono)) {
    Swal.fire(
      '¡Teléfono inválido!',
      'El teléfono debe contener solo números y un símbolo "+" (opcional), con un máximo de 15 caracteres.',
      'warning'
    );
    return;
  }

  try {

    email = email.trim() === '' ? "NT" : email;

    // Realiza una solicitud POST al servidor con los datos del paciente
    const response = await fetch('http://localhost:8080/api/pacientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        paciente: `${nombre} ${apellido}`,
        cedula,
        direccion,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        lugar_nacimiento: lugarNacimiento,
        estado_civil: estadoCivil,
        nacionalidad,
        antecedentes,
        sexo,
        email,
        borrado: 0
      })
    });

    if (response.ok) {
      // Si la respuesta es exitosa, realiza las acciones necesarias
      // Restablece los valores de los campos del formulario si es necesario
      document.getElementById('i_cedula').value = '';
      document.getElementById('i_fnac').value = '';
      document.getElementById('i_nombre').value = '';
      document.getElementById('i_apellido').value = '';
      document.getElementById('s_nacionalidad').value = '';
      document.getElementById('i_lnac').value = '';
      document.getElementById('i_direccion').value = '';
      document.getElementById('i_telefono').value = '';
      document.getElementById('i_email').value = '';
      document.getElementById('s_edocivil').value = '';
      document.getElementById('ta_antecedentes').value = '';

      // Mostrar SweetAlert 2 de éxito
      Swal.fire(
        '¡Guardado!',
        'Los datos del paciente se han guardado correctamente.',
        'success'
      ).then(() => {
        window.location.href = 'pacientes.html';
      })
    } else {
      // Si la respuesta no es exitosa, mostrar SweetAlert 2 de error
      Swal.fire(
        '¡Error!',
        'Error al crear el paciente.',
        'error'
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

function calcularEdad() {
  const inputFnac = document.getElementById("i_fnac");
  const spanEdad = document.getElementById("span_edad");

  if (inputFnac.value) {
    const fechaNacimiento = new Date(inputFnac.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate()-1 < fechaNacimiento.getDate())) {
      edad--;
    }

    spanEdad.textContent = `(${edad} Años)`;
  } else {
    spanEdad.textContent = "";
  }
}

// Agrega un evento para que se calcule la edad cuando cambie el valor del input
const inputFnac = document.getElementById("i_fnac");
inputFnac.addEventListener("change", calcularEdad);

// Calcula la edad inicialmente al cargar la página
calcularEdad();


