const barra_header = document.querySelector("#barra_header");

barra_header.innerHTML = 
  `<div class="m-header">
      <a class="mobile-menu" id="mobile-collapse1" href="javascript:"><span></span></a>
      <a href="index.html" class="b-brand">

        <div class="b-bg">
          <i class="fas fa-user-md"></i>
        </div>

        <span class="b-title">TraumaMed</span>
      </a>
  </div>

  <a class="mobile-menu" id="mobile-header" href="javascript:">
    <i class="feather icon-more-horizontal"></i>
  </a>

  <div class="collapse navbar-collapse">

    <ul class="navbar-nav ml-auto">
      <li>
        <div class="dropdown drp-user">
          <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown"></a>

          <div class="dropdown-menu dropdown-menu-right profile-notification">
            <div class="pro-head">

              <img
                src="assets/images/user/avatar-${ sessionStorage.getItem("nombre") == "Arla Inc Tech" ? "2" : "2"}.jpg"
                class="img-radius"
                alt="User-Profile-Image"
              />
              <span>${sessionStorage.getItem('nombre')}</span>

              <a href="javascript:void(0)" class="dud-logout" title="Logout" id="logout_btn" onclick="logout()">
                  <i class="feather icon-log-out"></i>
              </a>
                </div>
            </div>
          </div>
        </li>
    </ul>
  </div>`
;
