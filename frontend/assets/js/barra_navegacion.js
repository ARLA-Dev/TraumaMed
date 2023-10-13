const barra_navegacion = document.querySelector("#barra_navegacion");

barra_navegacion.innerHTML = 
    `<nav class="pcoded-navbar">
      <div class="navbar-wrapper">

        <div class="navbar-brand header-logo">
          <a href="index.html" class="b-brand">
            <div class="b-bg">
              <i class="fas fa-user-md"></i>
            </div>
            <span class="b-title" style="font-size: 30px;">FemiSys</span>
          </a>
        </div>

        <div class="navbar-content scroll-div">
          <ul class="nav pcoded-inner-navbar">
            <li class="nav-item pcoded-menu-caption">
              <label style="font-size: 14px;">Navegación</label>
            </li>

            <li class="nav-item" id="elemento_index">
              <a href="index.html" class="nav-link">
                <span class="pcoded-micon">
                  <i class="fa fa-home"></i>
                </span>
                <span class="pcoded-mtext">Dashboard</span>
              </a>
            </li>

            <li class="nav-item" id="elemento_pacientes">
              <a href="pacientes.html" class="nav-link"
                ><span class="pcoded-micon"
                  ><i class="fa fa-users"></i></span
                ><span class="pcoded-mtext">Pacientes</span></a>
            </li>

            <li class="nav-item" id="elemento_consultas">
              <a href="consultas.html" class="nav-link">
                <span class="pcoded-micon">
                  <i class="fa fa-notes-medical"></i></span>
                <span class="pcoded-mtext">Consultas</span></a>
            </li>

            <li class="nav-item" id="elemento_ajustes">
              <a href="ajustes.html" class="nav-link">
                <span class="pcoded-micon">
                  <i class="fa fa-cog"></i></span>
                <span class="pcoded-mtext">Ajustes</span></a>
            </li>

          </ul>
        </div>
      </div>
    </nav>`
;

function marcar_activo() {
  if(pagina === "index"){
    document.getElementById("elemento_index").classList.add("active");
  }
  if(pagina === "pacientes"){
    document.getElementById("elemento_pacientes").classList.add("active");
  }
  if(pagina === "consultas"){
    document.getElementById("elemento_consultas").classList.add("active");
  }
  if(pagina === "ajustes"){
    document.getElementById("elemento_ajustes").classList.add("active");
  }
}

marcar_activo();