SetVariablesGlobales();
function SetVariablesGlobales() {
    pagHome = document.querySelector("#home");
    pagLogin = document.querySelector("#login");
    pagRegistro = document.querySelector("#registro");
    pagAddPersona = document.querySelector("#agregarPersona");
    pagListado = document.querySelector("#verPersonas");
    pagCensadosTotales = document.querySelector("#censadosTotales");
    pagMapa = document.querySelector("#verMapa");
}
let apiKey = "";
document.querySelector("#ruteo").addEventListener("ionRouteWillChange", mostrarPagina);

function mostrarPagina(evento) {
    console.log(evento);
    if(evento.detail.to == "/") {
        document.querySelector("#home").style.display = "block";
        document.querySelector("#login").style.display = "none";
        document.querySelector("#registro").style.display = "none";
        document.querySelector("#agregarPersona").style.display = "none";
        document.querySelector("#verPersonas").style.display = "none";
        document.querySelector("#censadosTotales").style.display = "none";
        document.querySelector("#verMapa").style.display = "none";
    }else if(evento.detail.to == "/login") {
        pagHome.style.display = "none";
        pagLogin.style.display = "block";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    }else if(evento.detail.to == "/registro") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "block";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    }else if(evento.detail.to == "/agregarPersona") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "block";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    }else if(evento.detail.to == "/verPersonas") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "block";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    }else if(evento.detail.to == "/censadosTotales") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "block";
        pagMapa.style.display = "none";
    }else if(evento.detail.to == "/verMapa") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "block";
    }

}

function CerrarMenu(){
    document.querySelector("#menu").close();
}
function RegistrarUsuarioAPI(datosUsuario) {
    fetch("https://censo.develotion.com/usuarios.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmNjZGM3ZWNlYTMxNTAwMTUzY2IxZGUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNjU3NTkyOTU4fQ.b0fHPd-m-ldbKkYU1OuSgYes79z9K15OYqgVOFxNnWo"
        },
        body: JSON.stringify(datosUsuario)
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.error.length != 0) {
                throw new Error(data.error)
            }
            document.querySelector("#errorMessageRegistro").innerHTML = "¡Registro exitoso! Ya puede loguearse";
            LimpiarCampos();
        })
        .catch(Error => {
            document.querySelector("#errorMessageRegistro").innerHTML = Error.message
        });
}
function LoguearUsuarioAPI(datosUsuario) {
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
            if (data.error.codigo != 200) {
                throw new Error(`${data.mensaje}`)
            }
            document.querySelector("#errorMessage").innerHTML = "Login exitoso";
            hayUsuarioLogueado = true;
            apiKey = data.data.apiKey;
        })
        .catch(Error => {
            return Error.json();
        })
        .then(datosError =>{
            if(datosError != undefined){
                document.querySelector("#errorMessage").innerHTML = datosError.error;
            }
        })
}