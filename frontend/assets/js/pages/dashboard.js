function actualizarHora() {
  const fechaActual = new Date();

  const diaSemana = obtenerDiaSemana(fechaActual.getDay());
  const diaNumero = fechaActual.getDate();
  const mes = obtenerMes(fechaActual.getMonth());
  const anio = fechaActual.getFullYear();
  const hora = obtenerHoraConSegundos(
    fechaActual.getHours(),
    fechaActual.getMinutes(),
    fechaActual.getSeconds()
  );

  document.querySelector(
    ".dia"
  ).innerHTML = `${diaSemana} <span class="text-muted dia-numero">${diaNumero}</span>`;
  document.querySelector(
    ".mes"
  ).innerHTML = `<span class="text-muted m-r-5 tamano">Mes:</span>${mes}`;
  document.querySelector(
    ".anio"
  ).innerHTML = `<span class="text-muted m-r-5 tamano">Año:</span>${anio}`;
  document.getElementById("hora").innerText = hora;
}

function obtenerDiaSemana(diaSemanaNum) {
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  return diasSemana[diaSemanaNum];
}

function obtenerMes(mesNum) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[mesNum];
}

function obtenerHoraConSegundos(horas, minutos, segundos) {
  const amPm = horas >= 12 ? "PM" : "AM";
  const hora12 = horas % 12 || 12;
  return `${hora12.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")} ${amPm}`;
}

setInterval(actualizarHora, 1000); // Actualizar cada segundo (1000 ms)

function getToken() {
    const token = sessionStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  }

  // Función para obtener los datos de los endpoints y actualizar los elementos HTML
  function obtenerDatos() {
    // Endpoint para obtener el total de pacientes registrados
    fetch("http://localhost:9090/api/pacientes/total", {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const pacientesRegistradosValue = document.getElementById(
          "pacientesRegistradosValue"
        );
        pacientesRegistradosValue.textContent = data;
      })
      .catch((error) => console.error("Error:", error));

    // Endpoint para obtener el total de consultas totales
    fetch("http://localhost:9090/api/consultas/total", {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const consultasTotalesValue = document.getElementById(
          "consultasTotalesValue"
        );
        consultasTotalesValue.textContent = data;
      })
      .catch((error) => console.error("Error:", error));

    // Endpoint para obtener el total de consultas de este año
    fetch("http://localhost:9090/api/consultas/total/anual", {
      headers: {
        Authorization: getToken(),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        const consultasAnualesValue = document.getElementById(
          "consultasAnualesValue"
        );
        consultasAnualesValue.textContent = data;
      })
      .catch((error) => console.error("Error:", error));

// Endpoint para obtener los datos de consultas mensuales
fetch("http://localhost:9090/api/consultas/total/anual/mensual", {
  headers: {
    Authorization: getToken(),
  },
})
  .then((response) => response.json()) // Parsea la respuesta como JSON
  .then((data) => {
    const formattedData = data.map(([fecha, cantidad]) => ({
      y: fecha,
      a: cantidad,
    }));

    // Código para configurar y renderizar el gráfico Morris
    Morris.Bar({
      element: 'morris-bar-stacked-chart',
      data: formattedData,
      xkey: 'y',
      ykeys: ['a'],
      labels: ['Consultas'],
      stacked: true,
      barSizeRatio: 0.50,
      barGap: 3,
      resize: true,
      responsive: true,
      barColors: ["0-#c8b6ff-#9c89b8"],
    });
  })
  .catch((error) => console.error("Error:", error));



  }

  // Llama a la función para obtener los datos al cargar la página
  obtenerDatos();
