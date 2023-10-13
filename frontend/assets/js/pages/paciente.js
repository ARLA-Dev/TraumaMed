let currentUrl = window.location.href;

if (!currentUrl.match(/\/paciente.html\?cedula=\d+/)) {
  window.location.href = "pacientes.html";
} else {
  let urlParams = new URLSearchParams(window.location.search);
  let cedula = urlParams.get("cedula");

  if (/^\d+$/.test(cedula) && cedula.trim() !== "") {
    obtenerDatosPaciente(cedula);
    obtenerConsultasPaciente(cedula);
  } else {
    window.location.href = "pacientes.html";
  }
}

const fechaHoy = new Date().toISOString().split('T')[0];
document.getElementById('i_fnac').max = fechaHoy;

function obtenerConsultasPaciente(cedula) {
  fetch(`http://localhost:8080/api/consultas/${cedula}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parsear la respuesta JSON
      } else {
        throw new Error("Error al obtener las consultas del paciente");
      }
    })
    .then((data) => {
      // Obtener la tabla de consultas
      let tablaConsultas = document.querySelector(".table tbody");

      // Limpiar el contenido actual de la tabla
      tablaConsultas.innerHTML = "";

      // Ordenar las consultas por fecha en orden descendente
      data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Variables para la paginación
      const itemsPerPage = 10;
      let currentPage = 1;
      let currentData = data;

      // Función para renderizar los datos de la página actual
      function renderPage() {
        // Limpiar el cuerpo de la tabla
        tablaConsultas.innerHTML = "";

        // Obtener los datos correspondientes a la página actual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = currentData.slice(startIndex, endIndex);

        // Iterar sobre los datos de las consultas de la página actual
        pageData.forEach((consulta, index) => {
          let fila = document.createElement("tr");

          let numeroConsulta = document.createElement("td");
          numeroConsulta.textContent = currentData.length - startIndex - index;
          fila.appendChild(numeroConsulta);

          let fecha = document.createElement("td");
          let fechaConsulta = new Date(consulta.fecha);
          let fechaFormateada = fechaConsulta.toISOString().split("T")[0];
          fecha.textContent = fechaFormateada;
          fila.appendChild(fecha);

          let peso = document.createElement("td");
          peso.textContent = consulta.peso;
          fila.appendChild(peso);

          let notaEvolutiva = document.createElement("td");
          notaEvolutiva.textContent = consulta.nota_evolutiva;
          fila.appendChild(notaEvolutiva);

          let documentos = document.createElement("td");
          let verDocumentos = document.createElement("a");
          verDocumentos.className = "see";
          verDocumentos.style.cursor = "pointer";
          verDocumentos.innerHTML = '<i class="material-icons color-m">&#xe8f4;</i>';

          verDocumentos.addEventListener("click", () => {
            mostrarModalDocumentos(consulta.id); // Llamada a la función para mostrar el modal
          });

          documentos.appendChild(verDocumentos);
          fila.appendChild(documentos);
          tablaConsultas.appendChild(fila);
        });

        // Actualizar la paginación
        updatePagination();
      }

      // Función para actualizar los enlaces de paginación
      function updatePagination() {
        const totalPages = Math.ceil(currentData.length / itemsPerPage);
        const paginationContainer = document.querySelector(".pagination");

        paginationContainer.innerHTML = "";

        const maxVisiblePages = 5;
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

      // Renderizar la página inicial
      renderPage();

      const filtradoInput = document.getElementById("filtrado");

      filtradoInput.addEventListener("input", () => {
        const filtro = filtradoInput.value.trim().toLowerCase();
        currentData = data.filter((consulta) => {
          const fecha = consulta.fecha.toLowerCase();
          return fecha.includes(filtro);
        });

        // Actualizar la página y la paginación con los nuevos datos filtrados
        currentPage = 1;
        renderPage();
        updatePagination();
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function obtenerDatosPaciente(cedula) {
  fetch(`http://localhost:8080/api/pacientes/${cedula}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parsear la respuesta JSON
      } else {
        throw new Error("Error al obtener los datos del paciente");
      }
    })
    .then((data) => {
      document.getElementById("i_cedula").value = data.cedula;
      document.getElementById("i_fnac").value = formatDate(
        data.fecha_nacimiento
      );
      document.getElementById("i_nombre").value = data.paciente;
      document.getElementById("s_nacionalidad").value = data.nacionalidad;
      document.getElementById("i_lnac").value = data.lugar_nacimiento;
      document.getElementById("i_direccion").value = data.direccion;
      document.getElementById("i_telefono").value = data.telefono;
      document.getElementById("i_email").value = data.email;
      document.getElementById("s_edocivil").value = data.estado_civil;
      document.getElementById("ta_antecedentes").value = data.antecedentes;

      const agregarConsultaLink = document.querySelector(
        "#agregarConsultaEnlace"
      );
      agregarConsultaLink.href = `crearConsulta.html?cedula=${cedula}`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function sumarUnDia(fecha) {
  const date = new Date(fecha);
  date.setDate(date.getDate() + 1); // Sumar un día
  return date.toISOString().split('T')[0];
}

const modificarBtn = document.querySelector("#btn_modificar");

modificarBtn.addEventListener("click", () => {
  const cedula = document.getElementById("i_cedula").value;
  const paciente = document.getElementById("i_nombre").value;
  const direccion = document.getElementById("i_direccion").value;
  const telefono = document.getElementById("i_telefono").value;
  let fechaNacimiento = document.getElementById("i_fnac").value;
  fechaNacimiento = sumarUnDia(fechaNacimiento);
  const lugarNacimiento = document.getElementById("i_lnac").value;
  const estadoCivil = document.getElementById("s_edocivil").value;
  const nacionalidad = document.getElementById("s_nacionalidad").value;
  const antecedentes = document.getElementById("ta_antecedentes").value;
  const sexo = "Femenino";
  const email = document.getElementById("i_email").value;

  if (
    cedula.trim() === "" ||
    paciente.trim() === "" ||
    direccion.trim() === "" ||
    telefono.trim() === "" ||
    fechaNacimiento.trim() === "" ||
    lugarNacimiento.trim() === "" ||
    estadoCivil.trim() === "" ||
    nacionalidad.trim() === "" ||
    antecedentes.trim() === ""
  ) {
    Swal.fire(
      "¡Campos vacíos!",
      "Por favor completa todos los campos.",
      "warning"
    );
    return;
  }

  if (email !== 'NT') {
    if (!/^.+@.+\..+$/.test(email) || email.length > 255) {
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
      'El teléfono debe contener solo números y un símbolo "+" opcional, con un máximo de 15 caracteres.',
      'warning'
    );
    return;
  }

  const nombreCompleto = paciente;

  if (nombreCompleto.length > 255 || lugarNacimiento.length > 255 || direccion.length > 255) {
    Swal.fire(
      '¡Texto demasiado largo!',
      'Los campos de nombre, apellido, lugar de nacimiento y dirección no pueden exceder los 255 caracteres.',
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


  if (!/^\d{1,15}$/.test(cedula)) {
    Swal.fire(
      '¡Cédula inválida!',
      'La cédula debe contener solo números y tener 15 caracteres o menos.',
      'warning'
    );
    return;
  }


  fetch(`http://localhost:8080/api/pacientes/${cedula}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      paciente,
      direccion,
      telefono,
      fecha_nacimiento: fechaNacimiento,
      lugar_nacimiento: lugarNacimiento,
      estado_civil: estadoCivil,
      nacionalidad,
      antecedentes,
      sexo,
      email,
    }),
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos del paciente se actualizaron correctamente.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al modificar los datos del paciente.',
        })
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al modificar los datos del paciente.',
      });
    });
});

function mostrarModalDocumentos(idConsulta) {

  fetch(`http://localhost:8080/api/consultas/detalle/${idConsulta}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parsear la respuesta JSON
      } else {
        throw new Error("Error al obtener los detalles de la consulta");
      }
    })
    .then((data) => {
      
      if (data.length > 0) {
        // Obtener el modal y los elementos del modal
        const modal = document.getElementById("modalDocumentos");
        const recipe = modal.querySelector(".recipe-modal");
        const indicaciones = modal.querySelector(".indicaciones-modal");

        // Mostrar los datos en el modal con formato (usar innerHTML directamente)
        recipe.innerHTML = data[0][0] || "No hay datos disponibles";
        indicaciones.innerHTML = data[0][1] || "No hay datos disponibles";

        // Mostrar el modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Agregar evento para cerrar el modal al hacer clic en el botón de cerrar
        const closeButton = modal.querySelector(".btn-close");
        closeButton.addEventListener("click", () => {
          bsModal.hide();
        });
      } else {
        alert("No se encontraron datos para esta consulta.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function imprimirPDF() {
  window.jsPDF = window.jspdf.jsPDF;
  const pdf = new jsPDF({
    unit: 'in',
    format: [8.5, 5.5],
    orientation: 'landscape',
    margin: 0.25,
  });

  const imageUrl = "./assets/images/recipe/header.jpg";
  const footerImageUrl = "./assets/images/recipe/footer.jpg";
  const imageWidth = pdf.internal.pageSize.getWidth() / 2 - 0.5;
  const img = new Image();
  img.src = imageUrl;

  img.onload = function () {
    const imageHeight = (img.height * imageWidth) / img.width;

    // Obtener los datos del paciente desde el formulario
    const nombrePaciente = document.getElementById("i_nombre").value;
    const cedulaNacionalidad = document.getElementById("s_nacionalidad").value.charAt(0) + document.getElementById("i_cedula").value;
    const fechaConsulta = document.querySelector(".table tbody tr:first-child td:nth-child(2)").textContent; // Obtener la fecha de la primera consulta
    const indicacionesPaciente = document.querySelector(".indicaciones-modal").textContent === "No hay datos disponibles" ? "" : document.querySelector(".indicaciones-modal").textContent;
    const recipePaciente = document.querySelector(".recipe-modal").textContent === "No hay datos disponibles" ? "" : document.querySelector(".recipe-modal").textContent;

    // Columna izquierda (Recipe)
    pdf.addImage(imageUrl, 'JPEG', 0.25, 0.25, imageWidth, imageHeight);
    let y = imageHeight + 0.4;

    pdf.setFontSize(8); // Tamaño de letra más pequeño
    pdf.text(`Nombre: ${nombrePaciente}`, 0.25, y);
    y += 0.2;
    pdf.text(`Cedula: ${cedulaNacionalidad}`, 0.25, y);
    y += 0.2;
    pdf.text(`Fecha: ${fechaConsulta}`, 0.25, y);

    y += 0.4;

    pdf.setFontSize(10); // Restaurar el tamaño de letra para el título
    pdf.text('RECIPE', 0.25, y);
    y += 0.05;
    pdf.setLineWidth(0.01);
    pdf.line(0.25, y, 3.75, y);
    y += 0.1;

    // Texto del Recipe
    pdf.setFontSize(8); // Tamaño de letra más pequeño
    const splitRecipe = pdf.splitTextToSize(recipePaciente, 3.5);
    pdf.text(0.25, y, splitRecipe);

    // Agregar imagen de footer en la columna izquierda (Recipe)
    const footerImgWidth = 4;
    const footerImgHeight = (.5 * footerImgWidth) / 4;
    pdf.addImage(footerImageUrl, 'JPEG', 0.25, pdf.internal.pageSize.getHeight() - footerImgHeight - 0.25, footerImgWidth, footerImgHeight);

    // Columna derecha (Indicaciones)
    pdf.addImage(imageUrl, 'JPEG', pdf.internal.pageSize.getWidth() / 2 + 0.25, 0.25, imageWidth, imageHeight);
    y = imageHeight + 0.4;

    pdf.setFontSize(8); // Tamaño de letra más pequeño
    pdf.text(`Nombre: ${nombrePaciente}`, pdf.internal.pageSize.getWidth() / 2 + 0.25, y);
    y += 0.2;
    pdf.text(`Cedula: ${cedulaNacionalidad}`, pdf.internal.pageSize.getWidth() / 2 + 0.25, y);
    y += 0.2;
    pdf.text(`Fecha: ${fechaConsulta}`, pdf.internal.pageSize.getWidth() / 2 + 0.25, y);

    y += 0.4;

    pdf.setFontSize(10); // Restaurar el tamaño de letra para el título
    pdf.text('INDICACIONES', pdf.internal.pageSize.getWidth() / 2 + 0.25, y);
    y += 0.05;
    pdf.setLineWidth(0.01);
    pdf.line(pdf.internal.pageSize.getWidth() / 2 + 0.25, y, pdf.internal.pageSize.getWidth() - 0.25, y);
    y += 0.1;

    // Texto de las Indicaciones
    pdf.setFontSize(8); // Tamaño de letra más pequeño
    const splitIndicaciones = pdf.splitTextToSize(indicacionesPaciente, 3.5);
    pdf.text(pdf.internal.pageSize.getWidth() / 2 + 0.25, y, splitIndicaciones);

    // Agregar imagen de footer en la columna derecha (Indicaciones)
    pdf.addImage(footerImageUrl, 'JPEG', pdf.internal.pageSize.getWidth() / 2 + 0.25, pdf.internal.pageSize.getHeight() - footerImgHeight - 0.25, footerImgWidth, footerImgHeight);

    pdf.output('dataurlnewwindow');
  };
}



