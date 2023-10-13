// Obtén una referencia al elemento HTML donde se mostrarán los datos del paciente
const nombreElement = document.getElementById("h3_nombre");
const cedulaElement = document.getElementById("span_ci");
const numConsultaElement = document.getElementById("h6_numConsulta");

// Función para obtener los datos del paciente
async function obtenerDatosPaciente(cedula) {
  try {
    const response = await fetch(
      `http://localhost:9090/api/pacientes/${cedula}/consulta`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      llenarDatosPaciente(data);
    } else {
      alert("Error al obtener los datos del paciente");
    }
  } catch (error) {
    alert("Error:", error);
  }
}

// Función para llenar los datos del paciente en el HTML
function llenarDatosPaciente(data) {

  let letra = data.nacionalidad;
  letra = letra.charAt(0);
  nombreElement.textContent = data.paciente;
  cedulaElement.textContent = letra + "" + data.cedula;

  numConsultaElement.textContent = `Esta es mi consulta N°${
    data.cantidadConsultas + 1
  }`;
}

// Obtén la cédula del paciente de la URL
const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get("cedula");

if (/^\d+$/.test(cedula) && cedula.trim() !== "") {
  obtenerDatosPaciente(cedula);
  const fechaConsultaElement = document.getElementById("i_fcon");

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  function obtenerFechaActual() {
    const fechaActual = new Date();
    const year = fechaActual.getFullYear();
    let month = fechaActual.getMonth() + 1;
    let day = fechaActual.getDate();

    // Añade un cero al mes y al día si son menores que 10
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  // Establece la fecha actual como valor por defecto en el campo de fecha de la consulta
  fechaConsultaElement.value = obtenerFechaActual();
} else {
  window.location.href = "pacientes.html";
}

//CREAR CONSULTA

// Obtén una referencia al botón de guardar
const guardarBtn = document.querySelector("#btn_guardar");

function sumarUnDia(fecha) {
  const date = new Date(fecha);
  date.setDate(date.getDate() + 1); // Sumar un día
  return date.toISOString().split("T")[0];
}

// Agrega un event listener al botón de guardar
guardarBtn.addEventListener("click", async function (event) {

  const cedula = urlParams.get("cedula");
  const fechaConsultaElement = document.getElementById("i_fcon");
  const fecha = sumarUnDia(fechaConsultaElement.value); 
  const notaEvolutiva = document.getElementById("ta_notaEvolutiva").value;
  const recipe = document.getElementById("text-recipe").value;
  const indicaciones = document.getElementById("text-indicaciones").value;
  const pesoInput = document.getElementById("i_peso");
  const peso = parseFloat(pesoInput.value.replace(",", "."));

  // Verificar si algún campo está vacío
  if (!cedula || isNaN(peso) || !fecha || !notaEvolutiva || !recipe.trim() || !indicaciones.trim()) {
    Swal.fire(
      "¡Campos vacíos!",
      "Por favor completa todos los campos para crear la consulta.",
      "warning"
    );
    return; 
  }

  if (isNaN(peso) || peso <= 0) {
    Swal.fire("¡Peso inválido!", "Por favor ingresa un peso válido mayor a 0.", "error");
    return; 
  }

  // Crea un objeto con los datos de la consulta en formato JSON
  const nuevaConsulta = {
    cedula,
    peso,
    fecha,
    nota_evolutiva: notaEvolutiva,
    recipe,
    indicaciones,
  };

  try {
    // Realiza una solicitud POST al servidor con los datos de la consulta
    const response = await fetch("http://localhost:9090/api/consultas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(nuevaConsulta),
    });

    if (response.ok) {
      // Si la respuesta es exitosa, muestra un mensaje con SweetAlert2
      if (response.ok) {
        // Si la respuesta es exitosa, muestra un mensaje con SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Consulta creada exitosamente.",
          showConfirmButton: true, // Muestra solo el botón "OK" de confirmación
        }).then((result) => {
          // Redirecciona después de hacer clic en "OK"
          const urlParams = new URLSearchParams(window.location.search);
          const cedula = urlParams.get("cedula");
          window.location.href = `paciente.html?cedula=${cedula}`;
        });
      }
      
    } else {
      // Si la respuesta no es exitosa, mostrar SweetAlert 2 de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear la consulta.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un error al crear la consulta.",
    });
  }
});



