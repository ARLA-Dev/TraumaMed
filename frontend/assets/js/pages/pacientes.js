// Variables para la paginación
const table = document.querySelector(".table");
const tableBody = table.querySelector("tbody");
const itemsPerPage = 25;
let currentPage = 1;
let originalData = [];
let currentData = [];

// Función para renderizar los datos de la página actual
function renderPage() {
  // Limpiar el cuerpo de la tabla
  tableBody.innerHTML = "";

  // Obtener los datos correspondientes a la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = currentData.slice(startIndex, endIndex);

  // Iterar sobre los datos de los pacientes de la página actual
  pageData.forEach((paciente) => {
    // Crear una nueva fila de la tabla
    const row = document.createElement("tr");

    // Agregar las celdas con los datos del paciente a la fila
    let letraCedula = paciente.nacionalidad.charAt(0);
    const cedulaCell = document.createElement("td");
    cedulaCell.textContent = letraCedula + paciente.cedula;
    row.appendChild(cedulaCell);

    const nombreCompletoCell = document.createElement("td");
    nombreCompletoCell.textContent = paciente.paciente;
    row.appendChild(nombreCompletoCell);

    const telefonoCell = document.createElement("td");
    telefonoCell.textContent = paciente.telefono;
    row.appendChild(telefonoCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = paciente.email;
    row.appendChild(emailCell);

    const fechaNacimientoCell = document.createElement("td");
    const fechaNacimiento = paciente.fecha_nacimiento.split("T")[0]; // Obtiene la parte de la fecha sin la hora
    fechaNacimientoCell.textContent = fechaNacimiento;
    row.appendChild(fechaNacimientoCell);

    const ageCell = document.createElement('td');
    const dob = new Date(paciente.fecha_nacimiento.split('T')[0]); // Parse the date of birth
    const today = new Date(); // Current date
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--; // Subtract 1 year if the birthday hasn't occurred yet this year
    }
    ageCell.textContent = age;
    row.appendChild(ageCell);

    const nacionalidadCell = document.createElement("td");
    nacionalidadCell.textContent = paciente.nacionalidad;
    row.appendChild(nacionalidadCell);

    // Crear las celdas para las acciones
    const accionesCell = document.createElement("td");
    const seeLink = document.createElement("a");
    seeLink.className = "see";
    seeLink.href = "paciente.html?cedula=" + paciente.cedula;
    seeLink.style.cursor = "pointer";
    seeLink.innerHTML = '<i class="material-icons color-m">&#xe8f4;</i>';
    accionesCell.appendChild(seeLink);

    const deleteLink = document.createElement("a");
    deleteLink.className = "delete";
    deleteLink.style.cursor = "pointer";
    deleteLink.innerHTML = '<i class="material-icons color-m">&#xE872;</i>';
    deleteLink.addEventListener("click", () => {
      // Obtener la cédula asociada al paciente
      const cedula = paciente.cedula;

      // Realizar la acción de eliminación del paciente con la cédula
      eliminarPaciente(cedula);
    });
    accionesCell.appendChild(deleteLink);

    // Agregar la celda de acciones a la fila
    row.appendChild(accionesCell);

    // Agregar la fila al cuerpo de la tabla
    tableBody.appendChild(row);
  });

  // Actualizar la paginación
  updatePagination();
}

// Función para actualizar los enlaces de paginación
function updatePagination() {
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginationContainer = document.querySelector(".pagination");

  paginationContainer.innerHTML = "";

  const maxVisiblePages = 20;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  let startPage = currentPage - halfVisiblePages;
  let endPage = currentPage + halfVisiblePages;

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(maxVisiblePages, totalPages);
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  }

  // Botón anterior
  const prevButton = document.createElement("li");
  prevButton.className = "page-item";
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "Anterior";
  prevLink.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
      updatePagination();
    }
  });

  prevButton.appendChild(prevLink);
  paginationContainer.appendChild(prevButton);

  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement("li");
    pageLink.className = "page-item";

    if (i === currentPage) {
      pageLink.classList.add("active");
    }

    const pageButton = document.createElement("a");
    pageButton.className = "page-link";
    pageButton.href = "#";
    pageButton.textContent = i;

    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderPage();
      updatePagination();
    });

    pageLink.appendChild(pageButton);
    paginationContainer.appendChild(pageLink);
  }

  // Botón siguiente
  const nextButton = document.createElement("li");
  nextButton.className = "page-item";
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Siguiente";

  nextLink.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
      updatePagination();
    }
  });

  nextButton.appendChild(nextLink);
  paginationContainer.appendChild(nextButton);
}

// Realizar la llamada fetch al endpoint api/pacientes
fetch("http://localhost:8080/api/pacientes", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
})
  .then((response) => {
    if (response.ok) {
      return response.json(); // Parsear la respuesta JSON
    } else {
      throw new Error("Error al obtener los pacientes");
    }
  })
  .then((data) => {
    // Guardar los datos obtenidos en originalData y currentData
    originalData = data;
    currentData = data;

    // Renderizar la página inicial
    renderPage();
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const pacienteInput = document.querySelector(
  'input[aria-label="Text input with checkbox"]'
);

pacienteInput.addEventListener("input", () => {
  filtrarPacientes();
});

pacienteInput.addEventListener("change", () => {
  filtrarPacientes();
});

function filtrarPacientes() {
  const filtro = pacienteInput.value.toLowerCase(); // Obtener el filtro en minúsculas

  if (filtro === "") {
    // Si el filtro está vacío, restaurar los datos originales
    currentData = originalData;
  } else {
    // Filtrar los pacientes según el filtro
    currentData = originalData.filter((paciente) => {
      const nombreCompleto = paciente.paciente.toLowerCase();
      const cedula = paciente.cedula.toLowerCase();
      return nombreCompleto.includes(filtro) || cedula.includes(filtro);
    });
  }

  // Renderizar la página y actualizar la paginación
  renderPage();
  updatePagination();
}

function eliminarPaciente(cedula) {
  // Mostrar un cuadro de diálogo de SweetAlert 2 para confirmar la eliminación
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      // Realizar la llamada fetch al endpoint correspondiente para eliminar el paciente
      fetch(`http://localhost:8080/api/pacientes/borrar/${cedula}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // Eliminación exitosa, mostrar SweetAlert de éxito y recargar la página
            Swal.fire(
              "¡Eliminado!",
              "El paciente ha sido eliminado.",
              "success"
            ).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire("¡Error!", "No se pudo eliminar el paciente.", "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
}
