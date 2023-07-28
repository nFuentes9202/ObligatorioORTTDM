SetVariablesGlobales();
EventListeners();
function SetVariablesGlobales() {
    pagHome = document.querySelector("#home");
    pagLogin = document.querySelector("#login");
    pagRegistro = document.querySelector("#registro");
    pagAddPersona = document.querySelector("#agregarPersona");
    pagListado = document.querySelector("#verPersonas");
    pagCensadosTotales = document.querySelector("#censadosTotales");
    pagMapa = document.querySelector("#verMapa");
}
function EventListeners(){
    document.querySelector("#ruteo").addEventListener("ionRouteWillChange", mostrarPagina);
    document.querySelector("#btnRegistrar").addEventListener("click",RegistroUsuario);
    document.querySelector("#btnLogin").addEventListener("click",LoguearUsuario);
}
let hayUsuarioLogueado = false;

function mostrarPagina(evento) {
    console.log(evento);
    OcultarPaginas();
    if(evento.detail.to == "/") {
        document.querySelector("#home").style.display = "block";
    }else if(evento.detail.to == "/login") {
        pagLogin.style.display = "block";

    }else if(evento.detail.to == "/registro") {
        pagRegistro.style.display = "block";

    }else if(evento.detail.to == "/agregarPersona") {
        pagAddPersona.style.display = "block";

    }else if(evento.detail.to == "/verPersonas") {
        pagListado.style.display = "block";

    }else if(evento.detail.to == "/censadosTotales") {
        pagCensadosTotales.style.display = "block";

    }else if(evento.detail.to == "/verMapa") {
        pagMapa.style.display = "block";
    }

}
function OcultarPaginas(){
    let paginas = document.querySelectorAll("ion-page");
    for(let i=0;i<paginas.length;i++){
        paginas[i].style.display="none";
    }
}

function CerrarMenu(){
    document.querySelector("#menu").close();
}
function RegistroUsuario(){
    let nombre = document.querySelector("#txtUsuarioRegistro").value.trim();
    let password = document.querySelector("#txtPasswordRegistro").value.trim();
    document.querySelector("#txtRegistro").innerHTML = "";
    try {
        if(nombre.length == 0 || password.length == 0){
            throw new Error("Ingrese datos válidos");
        }
        datosUsuario = {
            usuario:nombre,
            password:password
        }
        console.log(datosUsuario);
        fetch("https://censo.develotion.com/usuarios.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datosUsuario)
    })
        .then(response => {
            if(response.ok){
                document.querySelector("#txtRegistro").innerHTML = "Se ha registrado exitosamente";
                return response.json();
            } else{
                return Promise.reject(response);
            }
        })
        .then((data) => {

          })
          .catch((error) => {
            error.json().then((data) => {
              document.querySelector("#txtRegistro").innerHTML = data.mensaje;
            });
          });
    } catch (error) {
        document.querySelector("#txtRegistro").innerHTML = error.message
    }
}
function LimpiarCamposRegistro(){
    document.querySelector("#txtUsuarioRegistro").value = "";
    document.querySelector("#txtPasswordRegistro").value = "";
}
function LoguearUsuario(){
    let nombre = document.querySelector("#txtUsuarioLogin").value.trim();
    let password = document.querySelector("#txtPasswordLogin").value.trim();
    document.querySelector("#txtRegistro").innerHTML = "";
    try {
        if(nombre.length == 0 || password.length == 0){
            throw new Error("Ingrese datos válidos");
        }
        datosUsuario = {
            usuario:nombre,
            password:password
        }
        fetch("https://censo.develotion.com/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario),
    })
        .then(response => {
            if(response.status == 200){
                return response.json();
            } else{
                return Promise.reject(response);
            }
        })
        .then(data => {
            if (data.codigo != 200) {
                throw new Error(`${data.mensaje}`)
            }
            document.querySelector("#txtLogin").innerHTML = "Login exitoso";
            hayUsuarioLogueado = true;
            localStorage.setItem("apiKey",apiKey);
            localStorage.setItem("idUsuario",data.id);
        })
        .catch((error) => {
            error.json().then((data) => {
              document.querySelector("#txtLogin").innerHTML = data.mensaje;
            });
          })
        .then(datosError =>{
            if(datosError != undefined){
                document.querySelector("#txtLogin").innerHTML = datosError.error;
            }
        })
    } catch (error) {
        document.querySelector("#txtLogin").innerHTML = error.message;
    }
}
function LoguearUsuarioAPI(datosUsuario) {
    
}