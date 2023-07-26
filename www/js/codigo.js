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

document.querySelector("#ruteo").addEventListener("ionRouteWillChange", mostrarPagina);

function mostrarPagina(evento) {
    if(evento.detail.to == "/") {
        pagHome.style.display = "block";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
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