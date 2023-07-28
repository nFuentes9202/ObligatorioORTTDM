SetVariablesGlobales();
function SetVariablesGlobales() {
    pagHome = document.querySelector("#home");
    pagLogin = document.querySelector("#login");
    pagRegistro = document.querySelector("#registro");
    pagAddPersona = document.querySelector("#agregarPersona");
    pagListado = document.querySelector("#verPersonas");
    pagCensadosTotales = document.querySelector("#censadosTotales");
    pagMapa = document.querySelector("#verMapa");
    /*let hayUsuarioLogueado = false;
    let token;*/
    //inicializar();//inicializa la pagina
}

/*function inicializar() {
    Inicio(true);
}

function Inicio(showbuttons) {
    OcultarDivs();
    OcultarBotones(showbuttons);
    AgregarEventos();
}

function OcultarDivs() {

}

function OcultarBotones(showbuttons) {
    if (showbuttons) {
        document.querySelector("#btnLogin").style.display = "inline";
        document.querySelector("#btnRegistro").style.display = "inline";
        document.querySelector("#btnLogout").style.display = "none";
        document.querySelector("#btnAgregarPersona").style.display = "none";
        document.querySelector("#btnVerPersonas").style.display = "none";
        document.querySelector("#btnCensadosTotales").style.display = "none";
        document.querySelector("#btnVerMapa").style.display = "none";
    } else {
        document.querySelector("#btnLogin").style.display = "none";
        document.querySelector("#btnRegistro").style.display = "none";
        document.querySelector("#btnLogout").style.display = "inline";
        document.querySelector("#btnAgregarPersona").style.display = "inline";
        document.querySelector("#btnVerPersonas").style.display = "inline";
        document.querySelector("#btnCensadosTotales").style.display = "inline";
        document.querySelector("#btnVerMapa").style.display = "inline";
    }
}*/

let apiKey = "";
document.querySelector("#ruteo").addEventListener("ionRouteWillChange", mostrarPagina);

function mostrarPagina(evento) {
    console.log(evento);
    if (evento.detail.to == "/") {
        document.querySelector("#home").style.display = "block";
        document.querySelector("#login").style.display = "none";
        document.querySelector("#registro").style.display = "none";
        document.querySelector("#agregarPersona").style.display = "none";
        document.querySelector("#verPersonas").style.display = "none";
        document.querySelector("#censadosTotales").style.display = "none";
        document.querySelector("#verMapa").style.display = "none";
    } else if (evento.detail.to == "/login") {
        pagHome.style.display = "none";
        pagLogin.style.display = "block";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    } else if (evento.detail.to == "/registro") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "block";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    } else if (evento.detail.to == "/agregarPersona") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "block";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    } else if (evento.detail.to == "/verPersonas") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "block";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "none";
    } else if (evento.detail.to == "/censadosTotales") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "block";
        pagMapa.style.display = "none";
    } else if (evento.detail.to == "/verMapa") {
        pagHome.style.display = "none";
        pagLogin.style.display = "none";
        pagRegistro.style.display = "none";
        pagAddPersona.style.display = "none";
        pagListado.style.display = "none";
        pagCensadosTotales.style.display = "none";
        pagMapa.style.display = "block";
    }

}
function CerrarMenu() {
    document.querySelector("#menu").close();
}

/*SECCION REGISTRO*/
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

/*SECCION LOGIN Y LOGOUT*/
function LoguearUsuarioAPI(datosUsuario) {
    fetch("https://censo.develotion.com/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosUsuario),
    })
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
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
        .then(datosError => {
            if (datosError != undefined) {
                document.querySelector("#errorMessage").innerHTML = datosError.error;
            }
        })
}

function CerrarSesion() {
    /*hayUsuarioLogueado = false;
    document.querySelector("#btnCerrarSesion").style.display = "none";
    Inicio(true);*/
}

/*SECCION AGREGAR PERSONA*/

function CargarDepartamentosSlc() {
    if (localStorage.getItem("token") != null) {

        fetch("https://censo.develotion.com/departamentos.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "32f49d4aa829da944dc6ccd7f53380de"//apiKey
            }
        })
            .then(function (response) {//response es la respuesta del servidor
                if (response.ok) {//si la respuesta es correcta
                    return response.json();//retorna la respuesta en formato json
                } else if (response.status == 401) {//si la respuesta es incorrecta
                    alert("Es necesario volver a loguearse");//tira un alert
                    ruteo.push("/");//redirecciona al home
                } else {//si la respuesta es incorrecta
                    return Promise.reject(response);//tira el error
                }
            })
            .then(function (datosRespuesta) {
                let data = "";//crea una variable vacia
                for (let i = 0; i < datosRespuesta.data.length; i++) {//recorre el array de departamentos
                    data += `<option value="${datosRespuesta.data[i].id}">${datosRespuesta.data[i].nombre}</option>`;//le asigna el nombre del departamento
                }
                document.querySelector("slcDepartamentoAgregarPersona").innerHTML = data;//lo agrega al select
            })
            .catch(function (error) {//si hay error, lo muestra
                document.querySelector("#pErrorAgregarPersona").innerHTML = error.error;//muestra el error
            })
    }
}
function CargarCiudadesSlc() {
    if (localStorage.getItem("token") != null) {

        fetch("https://censo.develotion.com/ciudades.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-auth": "32f49d4aa829da944dc6ccd7f53380de"//apiKey
            }
        })
            .then(function (response) {//response es la respuesta del servidor
                if (response.ok) {//si la respuesta es correcta
                    return response.json();//retorna la respuesta en formato json
                } else if (response.status == 401) {//si la respuesta es incorrecta
                    alert("Es necesario volver a loguearse");//tira un alert
                    ruteo.push("/");//redirecciona al home
                } else {//si la respuesta es incorrecta
                    return Promise.reject(response);//tira el error
                }
            })
            .then(function (datosRespuesta) {
                let data = "";//crea una variable vacia
                for (let i = 0; i < datosRespuesta.data.length; i++) {//recorre el array de departamentos
                    if (datosRespuesta.data[i].idDepartamento == document.querySelector("#slcDepartamentoAgregarPersona").value) {//si el id del departamento es igual al id del departamento del select
                        data += `<option value="${datosRespuesta.data[i].id}">${datosRespuesta.data[i].nombre}</option>`;//le asigna el nombre del departamento
                    }
                }
                document.querySelector("slcDepartamentoAgregarPersona").innerHTML = data;//lo agrega al select
            })
            .catch(function (error) {//si hay error, lo muestra
                document.querySelector("#pErrorAgregarPersona").innerHTML = error.error;//muestra el error
            })
    }
}

function CargarOcupacionesSlc() {

}

document.querySelector("#btnAgregarPersona").addEventListener("click", CrearPersonaAgregar);

function CrearPersonaAgregar() {
    let ocupacionSelect = document.querySelector("#slcOcupacionAgregarPersona").value;//toma el valor del select

    let nombre = document.querySelector("#nombrePersonaAgregar").value;//toma el valor del input
    let departamento = document.querySelector("#departamentoPersonaAgregar").value;//toma el valor del input
    let ciudad = document.querySelector("#slcCiudadAgregarPersona").value;//toma el valor del input
    let fechaNacimiento = document.querySelector("#fechaNacPersonaAgregar").value;//toma el valor del input
    let ocupacion = ocupacionSelect.value;//toma el valor del select

    let edad = CalcularEdad(fechaNacimiento);//calcula la edad

    if (edad < 18) {//si es menor de 18 años
        ocupacionSelect.value = 5;//le asigna el valor 5
        ocupacionSelect.setAttribute("disabled", "disabled");//lo deshabilita
    } else {//si es mayor de 18 años
        ocupacionSelect.removeAttribute("disabled");//lo habilita y guarda id
    }

    let datosPersona = new Persona(nombre, departamento, ciudad, fechaNacimiento, ocupacion);//crea un objeto persona
    AgregarPersonaAPI(datosPersona);//lo agrega a la api
}

function CalcularEdad(fechaNacimiento) {
    let fNac = new Date(fechaNacimiento);
    let fActual = new Date();
    let edad = fActual.getFullYear() - fNac.getFullYear();
    return edad;
}

function AgregarPersonaAPI(datosPersona) {

}