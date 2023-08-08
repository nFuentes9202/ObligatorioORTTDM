let hayUsuarioLogueado;

let token;
let mapa;
let latitudOrigen = -34.8446286;
let longitudOrigen = -56.2147198;
let ocupacionesArray = [];
const ruteo = document.querySelector("#ruteo");
const menu = document.querySelector("#menu");
const pagHome = document.querySelector("#home");
const pagLogin = document.querySelector("#login");
const pagRegistro = document.querySelector("#registro");
const pagAddPersona = document.querySelector("#agregarPersona");
const pagListado = document.querySelector("#verPersonas");
const pagCensadosTotales = document.querySelector("#censadosTotales");
const pagMapa = document.querySelector("#verMapa");
navigator.geolocation.getCurrentPosition(SetearPosicionOrigen, MostrarError);
function SetearPosicionOrigen(position) {
    latitudOrigen = position.coords.latitude;
    longitudOrigen = position.coords.longitude;
}
function MostrarError(error) {
    CrearMensaje(error.message);
}
if (localStorage.getItem("idUsuario") != null) {
    hayUsuarioLogueado = true;
} else {
    hayUsuarioLogueado = false;
}
inicializar(hayUsuarioLogueado);//inicializa la pagina
function inicializar(hayUsuarioLogueado) {

    Inicio(hayUsuarioLogueado);
}
function Inicio(hayUsuarioLogueado) {
    OcultarBotones(hayUsuarioLogueado);
    EventListeners();
    if (hayUsuarioLogueado) {
        ruteo.push("/agregarPersona")
    } else {
        ruteo.push("/")
    }
}
function OcultarBotones(hayUsuarioLogueado) {
    if (!hayUsuarioLogueado) {//si no hay logueado
        document.querySelector("#btnLogin").style.display = "inline";
        document.querySelector("#btnRegistro").style.display = "inline";
        document.querySelector("#btnAgregarPersona").style.display = "none";
        document.querySelector("#btnVistaPersonas").style.display = "none";
        document.querySelector("#btnCensadosTotales").style.display = "none";
        document.querySelector("#btnVerMapa").style.display = "none";
        document.querySelector("#btnLogout").style.display = "none";
    } else {//si hay logueado
        document.querySelector("#btnLogin").style.display = "none";
        document.querySelector("#btnRegistro").style.display = "none";
        document.querySelector("#btnAgregarPersona").style.display = "block";
        document.querySelector("#btnVistaPersonas").style.display = "block";
        document.querySelector("#btnCensadosTotales").style.display = "block";
        document.querySelector("#btnVerMapa").style.display = "block";
        document.querySelector("#btnLogout").style.display = "block";
    }
}
function CerrarMenu() {
    menu.close();
}
function EventListeners() {
    document.querySelector("#btnRegistrar").addEventListener("click", RegistroUsuario);
    document.querySelector("#btnLoguear").addEventListener("click", LoguearUsuario);
    document.querySelector("#btnRedirectReg").addEventListener("click", RedirectARegistro);
    document.querySelector("#slcDepartamentoAgregarPersona").addEventListener("change", CargarCiudadesSlc);
    document.querySelector("#fechaNacPersonaAgregar").addEventListener("ionChange", CargarOcupacionesSlc);
    document.querySelector("#btnAgregarPersonaAPI").addEventListener("click", CrearPersonaAgregar);
    document.querySelector("#btnVistaPersonas").addEventListener("click", ListarPersonas);
    document.querySelector("#verPersonas ion-segment").addEventListener("ionChange", CambiarDivs);
    document.querySelector("#btnFiltrarPersonas").addEventListener("click", FiltrarPorOcupacion);
    document.querySelector("#btnLogout").addEventListener("click", CerrarSesion);
    document.querySelector("#btnCenso").addEventListener("click", BuscarCoordenadasPersonasCensadas);
    ruteo.addEventListener("ionRouteWillChange", mostrarPagina);//muestra la pagina a la que se dirige
}

function mostrarPagina(evento) {
    OcultarPaginas();
    if (evento.detail.to == "/") {
        pagLogin.style.display = "block";
    } else if (evento.detail.to == "/login") {
        pagLogin.style.display = "block";
    } else if (evento.detail.to == "/registro") {
        pagRegistro.style.display = "block";
        LimpiarCamposRegistro();
    } else if (evento.detail.to == "/agregarPersona") {
        CargarDepartamentosSlc();
        pagAddPersona.style.display = "block";
    } else if (evento.detail.to == "/verPersonas") {
        CargarOcupacionesAarray();
        pagListado.style.display = "block";
        const divVerPersonas = document.getElementById('divVerPersonas');
        const divFiltroVerPersonas = document.getElementById('divFiltroVerPersonas');
        divVerPersonas.style.display = 'block';
        divFiltroVerPersonas.style.display = 'none';
    } else if (evento.detail.to == "/censadosTotales") {
        MostrarCensados();
        pagCensadosTotales.style.display = "block";
    } else if (evento.detail.to == "/verMapa") {
        MostrarMapa();
        pagMapa.style.display = "block";
    }
}
function OcultarPaginas() {
    let paginas = document.querySelectorAll("ion-page");
    for (let i = 0; i < paginas.length; i++) {
        paginas[i].style.display = "none";
    }
}
function CambiarDivs(event) {
    const value = event.detail.value;
    const divVerPersonas = document.getElementById('divVerPersonas');
    const divFiltroVerPersonas = document.getElementById('divFiltroVerPersonas');
    if (value === 'todos') {
        divVerPersonas.style.display = 'block';
        divFiltroVerPersonas.style.display = 'none';
    } else if (value === 'filtrados') {
        divVerPersonas.style.display = 'none';
        divFiltroVerPersonas.style.display = 'block';
    }
}

/*SECCION REGISTRO LOGIN Y LOGOUT*/
function LoguearUsuario() {
    let nombre = document.querySelector("#txtUsuarioLogin").value.trim();
    let password = document.querySelector("#txtPasswordLogin").value.trim();
    document.querySelector("#txtLogin").innerHTML = "";
    try {
        if (nombre.length == 0 || password.length == 0) {
            throw new Error("Ingrese datos válidos");
        }
        datosUsuario = {
            usuario: nombre,
            password: password
        }
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
                if (data.codigo != 200) {
                    throw new Error(`${data.mensaje}`)
                }
                document.querySelector("#txtLogin").innerHTML = "Login exitoso";
                hayUsuarioLogueado = true;
                localStorage.setItem("apiKey", data.apiKey);
                localStorage.setItem("idUsuario", data.id);
                Inicio(true);
                OcultarBotones(true);
                ruteo.push("/agregarPersona");
            })
            .catch((error) => {
                error.json().then((data) => {
                    document.querySelector("#txtLogin").innerHTML = data.mensaje;
                });
            })
            .then(datosError => {
                if (datosError != undefined) {
                    CrearMensaje(datosError.error);
                }
            })
    } catch (error) {
        document.querySelector("#txtLogin").innerHTML = error.message;
    }
}
function LoguearUsuarioAlRegistrarse(usuario, password) {
    let nombreUsuario = usuario;
    let passwordUsuario = password;
    try {
        datosUsuario = {
            usuario: nombreUsuario,
            password: passwordUsuario
        }
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
                if (data.codigo != 200) {
                    throw new Error(`${data.mensaje}`)
                }
                document.querySelector("#txtLogin").innerHTML = "Login exitoso";
                hayUsuarioLogueado = true;
                localStorage.setItem("apiKey", data.apiKey);
                localStorage.setItem("idUsuario", data.id);
                Inicio(true);
                OcultarBotones(true);
                ruteo.push("/agregarPersona");
            })
            .catch((error) => {
                error.json().then((data) => {
                    CrearMensaje(data.mensaje);
                });
            })
            .then(datosError => {
                if (datosError != undefined) {
                    CrearMensaje(datosError.error)
                }
            })
    } catch (error) {
        CrearMensaje(error.message);
    }
}
function CrearMensaje(mensaje) {
    let toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 10000;
    document.body.appendChild(toast);
    return toast.present();
}
function CerrarSesion() {
    hayUsuarioLogueado = false;
    document.querySelector("#btnLogout").style.display = "none";
    localStorage.clear();
    Inicio(true);
    OcultarBotones(false);
    document.querySelector("#ruteo").push("/")
}
function RedirectARegistro() {
    document.querySelector("#ruteo").push("/registro");
}
function RegistroUsuario() {
    let nombre = document.querySelector("#txtUsuarioRegistro").value.trim();
    let password = document.querySelector("#txtPasswordRegistro").value.trim();
    document.querySelector("#txtRegistro").innerHTML = "";
    try {
        if (nombre.length == 0 || password.length == 0) {
            throw new Error("Ingrese datos válidos");
        }
        datosUsuario = {
            usuario: nombre,
            password: password
        }
        fetch("https://censo.develotion.com/usuarios.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datosUsuario)
            })
            .then(response => {
                if (response.ok) {
                    CrearMensaje("Se ha registrado exitosamente");
                    LoguearUsuarioAlRegistrarse(nombre, password);
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            })
            .then((data) => {
            })
            .catch((error) => {
                CrearMensaje(error.message);
            });
    } catch (error) {
        CrearMensaje(error.message)
    }
}
function LimpiarCamposRegistro() {
    document.querySelector("#txtUsuarioRegistro").value = "";
    document.querySelector("#txtPasswordRegistro").value = "";
}

/*SECCION AGREGAR PERSONA*/
function CargarDepartamentosSlc() {
    if (localStorage.getItem("apiKey") != null) {
        const apiKey = localStorage.getItem("apiKey");
        const idUsuario = localStorage.getItem("idUsuario");

        fetch("https://censo.develotion.com/departamentos.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey,
                "iduser": idUsuario
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                let data = "";
                data += `<option value="0">Seleccione un departamento</option>`;
                for (let i = 0; i < datosRespuesta.departamentos.length; i++) {
                    data += `<option value="${datosRespuesta.departamentos[i].id}">${datosRespuesta.departamentos[i].nombre}</option>`;
                }
                document.querySelector("#slcDepartamentoAgregarPersona").innerHTML = data;
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}
function CargarCiudadesSlc() {
    if (localStorage.getItem("apiKey") != null) {
        const apiKey = localStorage.getItem("apiKey");
        const idUsuario = localStorage.getItem("idUsuario");
        const idDepartamento = document.querySelector("#slcDepartamentoAgregarPersona").value;
        fetch(`https://censo.develotion.com/ciudades.php?idDepartamento=${idDepartamento}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey,
                "iduser": idUsuario
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                let data = "";
                data += `<option value="0">Seleccione una ciudad</option>`;
                for (let i = 0; i < datosRespuesta.ciudades.length; i++) {
                    data += `<option value="${datosRespuesta.ciudades[i].id}">${datosRespuesta.ciudades[i].nombre}</option>`;
                }
                document.querySelector("#slcCiudadAgregarPersona").innerHTML = data;
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}
function CargarOcupacionesSlc() {
    if (localStorage.getItem("apiKey") != null) {
        const apiKey = localStorage.getItem("apiKey");
        const idUsuario = localStorage.getItem("idUsuario");
        const fechaNac = document.querySelector("#fechaNacPersonaAgregar").value;

        const currentDate = new Date();
        const fechaNacimiento = new Date(fechaNac);
        const edad = currentDate.getFullYear() - fechaNacimiento.getFullYear();

        fetch("https://censo.develotion.com/ocupaciones.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey,
                "iduser": idUsuario
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                let data = "";
                data += `<option value="0">Seleccione una ocupacion</option>`;

                for (let i = 0; i < datosRespuesta.ocupaciones.length; i++) {
                    if (edad < 18 && datosRespuesta.ocupaciones[i].id == 5) {
                        data += `<option value="${datosRespuesta.ocupaciones[i].id}">${datosRespuesta.ocupaciones[i].ocupacion}</option>`;
                    } else if (edad >= 18) {
                        data += `<option value="${datosRespuesta.ocupaciones[i].id}">${datosRespuesta.ocupaciones[i].ocupacion}</option>`;
                    }
                }
                document.querySelector("#slcOcupacionAgregarPersona").innerHTML = data;
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}
function CrearPersonaAgregar() {
    try {
        let idUsuario = localStorage.getItem("idUsuario");

    let nombre = document.querySelector("#nombrePersonaAgregar").value;
    let departamento = document.querySelector("#slcDepartamentoAgregarPersona").value;
    let ciudad = document.querySelector("#slcCiudadAgregarPersona").value;
    let fechaNacimiento = document.querySelector("#fechaNacPersonaAgregar").value;
    let ocupacion = document.querySelector("#slcOcupacionAgregarPersona").value;;
        if(nombre.trim().length == 0){
            throw new Error("El nombre no puede ser vacío")
        }
        if(departamento == "0"){
            throw new Error("Seleccione un departamento por favor")
        }
        if(ciudad == "0"){
            throw new Error("Seleccione una ciudad por favor")
        }
        if(fechaNacimiento == undefined){
            throw new Error("Seleccione una fecha de nacimiento por favor")
        }
        if(ocupacion == 0){
            throw new Error("Seleccione una ocupación por favor")
        }
    let datosPersona = new Persona(idUsuario, nombre, departamento, ciudad, fechaNacimiento, ocupacion);
    AgregarPersonaAPI(datosPersona);
    } catch (error) {
        CrearMensaje(error.message)
    }
    
}
function AgregarPersonaAPI(datosPersona) {
    if (localStorage.getItem("apiKey") != null) {
        const apiKey = localStorage.getItem("apiKey");
        const idUsuario = localStorage.getItem("idUsuario");

        fetch("https://censo.develotion.com/personas.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey,
                "iduser": idUsuario
            },
            body: JSON.stringify(datosPersona)
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                } else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosPersona) {
                CrearMensaje("¡Persona agregada con exito!")
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}

/*SECCION VER PERSONAS*/
function CargarOcupacionesAarray() {
    if (localStorage.getItem("apiKey") != null) {
        fetch(`https://censo.develotion.com/ocupaciones.php`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "apikey": localStorage.getItem("apiKey"),
                "iduser": localStorage.getItem("idUsuario"),
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                }
                else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                for (let i = 0; i < datosRespuesta.ocupaciones.length; i++) {
                    const ocupacionData = datosRespuesta.ocupaciones[i];
                    const ocupacion = new Ocupacion(ocupacionData.id, ocupacionData.ocupacion);
                    ocupacionesArray.push(ocupacion);
                }
                CargarOcupacionesFiltro();
            })
            .catch(function (error) {
            })
    }
}
function ListarPersonas() {
    console.log(localStorage.getItem("apiKey"));
    if (localStorage.getItem("apiKey") != null) {
        console.log(localStorage.getItem("idUsuario"));
        const idUsuario = localStorage.getItem("idUsuario");
        fetch(`https://censo.develotion.com/personas.php?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "apikey": localStorage.getItem("apiKey"),
                "iduser": localStorage.getItem("idUsuario"),
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                }
                else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                let data = "";
                for (let i = 0; i < datosRespuesta.personas.length; i++) {
                    data += `<ion-card>`;
                    data += `<ion-card-header><ion-card-title>${datosRespuesta.personas[i].nombre}</ion-card-title></ion-card-header>`;
                    data += `<ion-card-content>`;
                    data += `<p>Nombre: ${datosRespuesta.personas[i].nombre}</p>`;
                    data += `<p>Fecha de nacimiento: ${datosRespuesta.personas[i].fechaNacimiento}</p>`;
                    let nombreOcupacion = "";
                    for (let j = 0; j < ocupacionesArray.length; j++) {
                        if (datosRespuesta.personas[i].ocupacion == ocupacionesArray[j].idOcupacion) {
                            nombreOcupacion = ocupacionesArray[j].nombre;
                        }
                    }
                    data += `<p>Ocupación: ${nombreOcupacion}</p>`;
                    data += `<ion-button fill="clear" onclick=EliminarDatos(${datosRespuesta.personas[i].id})>Eliminar</ion-button>`;
                    console.log(datosRespuesta.personas[i]._id);
                    data += `</ion-card-content></ion-card>`;
                }
                document.querySelector("#divVerPersonas").innerHTML = data;
            })
            .catch(function (error) {
                document.querySelector("#content-personas").innerHTML = error.error;
            })
    }
}
function EliminarDatos(idPersona) {
    const apiKey = localStorage.getItem("apiKey");
    if (apiKey != null) {
        fetch(`https://censo.develotion.com/personas.php?idCenso=${idPersona}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "apikey": apiKey,
                "iduser": localStorage.getItem("idUsuario"),
            }
        })
            .then(function (response) {
                if (response.ok) {
                    ListarPersonas();
                } else {
                    return Promise.reject(response);
                }
            })
            .catch(function (error) {
                console.error("Error al eliminar la persona:", error);
            });
    }
}
/*SECCION FILTRO X OCUPACION*/
function CargarOcupacionesFiltro() {
    let data = "";
    data += `<option value="0">Seleccione una ocupacion</option>`;

    for (let i = 0; i < ocupacionesArray.length; i++) {

        data += `<option value="${ocupacionesArray[i].idOcupacion}">${ocupacionesArray[i].nombre}</option>`;
    }
    document.querySelector("#slcFiltroVerPersonas").innerHTML = data;
}
function FiltrarPorOcupacion() {
    if (localStorage.getItem("apiKey") != null) {
        console.log(localStorage.getItem("idUsuario"));
        const idUsuario = localStorage.getItem("idUsuario");
        fetch(`https://censo.develotion.com/personas.php?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "apikey": localStorage.getItem("apiKey"),
                "iduser": localStorage.getItem("idUsuario"),
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status == 401) {
                    alert("Es necesario volver a loguearse");
                    ruteo.push("/");
                }
                else {
                    return Promise.reject(response);
                }
            })
            .then(function (datosRespuesta) {
                let data = "";
                for (let i = 0; i < datosRespuesta.personas.length; i++) {
                    if (datosRespuesta.personas[i].ocupacion == document.querySelector("#slcFiltroVerPersonas").value) {
                        data += `<ion-card>`;
                        data += `<ion-card-header><ion-card-title>${datosRespuesta.personas[i].nombre}</ion-card-title></ion-card-header>`;
                        data += `<ion-card-content>`;
                        data += `<p>Nombre: ${datosRespuesta.personas[i].nombre}</p>`;
                        data += `<p>Fecha de nacimiento: ${datosRespuesta.personas[i].fechaNacimiento}</p>`;
                        let nombreOcupacion = "";
                        for (let j = 0; j < ocupacionesArray.length; j++) {
                            if (datosRespuesta.personas[i].ocupacion == ocupacionesArray[j].idOcupacion) {
                                nombreOcupacion = ocupacionesArray[j].nombre;
                            }
                        }
                        data += `<p>Ocupación: ${nombreOcupacion}</p>`;
                        data += `<ion-button fill="clear" onclick=EliminarDatos(${datosRespuesta.personas[i].id})>Eliminar</ion-button>`;
                        console.log(datosRespuesta.personas[i]._id);
                        data += `</ion-card-content></ion-card>`;
                    }
                }
                document.querySelector("#pFiltroVerPersonas").innerHTML = data;
            })
            .catch(function (error) {
                document.querySelector("#content-personas").innerHTML = error.error;
            })
    }
}
/*SECCION CENSADOS TOTALES*/
function MostrarCensados() {
    if (localStorage.getItem("apiKey") != null) {
        let idUsuario = localStorage.getItem("idUsuario");
        fetch(`https://censo.develotion.com/personas.php?idUsuario=${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "iduser": idUsuario,
                "apiKey": localStorage.getItem("apiKey")
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else if (response.status == 401) {
                    CrearMensaje("Es necesario volver a loguearse");
                    localStorage.clear();
                    ruteo.push("/");
                } else {
                    return Promise.reject(response);
                }
            })
            .then(datosRespuesta => {
                let contadorMontevideo = 0;
                let contadorInterior = 0;
                for (let i = 0; i < datosRespuesta.personas.length; i++) {
                    const persona = datosRespuesta.personas[i];
                    if (persona.departamento == 3218) {
                        contadorMontevideo++
                    } else {
                        contadorInterior++
                    }
                }
                document.querySelector("#txtCensadosInterior").innerHTML = `El total de personas censadas en el interior es de ${contadorInterior} personas.`;
                document.querySelector("#txtCensadosMontevideo").innerHTML = `El total de personas censadas en Montevideo es de ${contadorMontevideo} personas.`;
                document.querySelector("#txtCensadosTotales").innerHTML = `El total de personas censadas es de ${contadorMontevideo + contadorInterior} personas.`;
            })
    }
}
/*VER MAPA*/
function MostrarMapa() {
    if (mapa != null) {
        mapa.remove();
    }
    mapa = L.map('map').setView([latitudOrigen, longitudOrigen], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(mapa);
    L.marker([latitudOrigen, longitudOrigen]).bindPopup("Acá estás vos").addTo(mapa);
}
function BuscarCoordenadasPersonasCensadas() {
    if (localStorage.getItem("apiKey") != null) {
        try {
            let km = Number(document.querySelector("#numKilometrosCenso").value);
            if (km == 0) {
                throw new Error("Ingrese un valor válido");
            }
            const idUsuario = localStorage.getItem("idUsuario");
            fetch(`https://censo.develotion.com/personas.php?idUsuario=${idUsuario}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "apikey": localStorage.getItem("apiKey"),
                    "iduser": localStorage.getItem("idUsuario"),
                }
            })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    }
                    else if (response.status == 401) {
                        alert("Es necesario volver a loguearse");
                        ruteo.push("/");
                    }
                    else {
                        return Promise.reject(response);
                    }
                })
                .then(function (datosRespuesta) {
                    datosRespuesta.personas.forEach(persona => {
                        fetch("https://censo.develotion.com/ciudades.php?idDepartamento=" + persona.departamento, {
                            method: "GET",
                            headers: {
                                "Content-type": "application/json",
                                "apikey": localStorage.getItem("apiKey"),
                                "iduser": localStorage.getItem("idUsuario"),
                            }
                        })
                            .then(response => {
                                if (response.ok) {
                                    return response.json();
                                } else {
                                    return Promise.reject(response);
                                }
                            })
                            .then(datosRespuesta => {
                                datosRespuesta.ciudades.forEach(ciudad => {
                                    if (ciudad.id == persona.ciudad) {
                                        let distancia = mapa.distance([latitudOrigen, longitudOrigen], [ciudad.latitud, ciudad.longitud]).toFixed(2);
                                        if (distancia <= km) {
                                            L.marker([ciudad.latitud, ciudad.longitud],).bindPopup(`${ciudad.nombre}`).addTo(mapa)

                                            CrearMensaje("Se ha añadido un punto nuevo")
                                        };
                                    }
                                });
                            })
                    })

                }
                )
                .catch(function (error) {
                    CrearMensaje(error.message);
                })

        } catch (error) {
            CrearMensaje(error.message);
        }
    }
}
