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
        //LimpiarCamposLogin();
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
        //CargarOcupacionesFiltro();
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
function RegistroUsuario() {//registra un usuario
    let nombre = document.querySelector("#txtUsuarioRegistro").value.trim();//trim saca los espacios en blanco
    let password = document.querySelector("#txtPasswordRegistro").value.trim();//trim saca los espacios en blanco
    document.querySelector("#txtRegistro").innerHTML = "";//limpia el mensaje de error
    try {//valida los datos
        if (nombre.length == 0 || password.length == 0) {//si no ingreso datos
            throw new Error("Ingrese datos válidos");//lanza el error
        }
        datosUsuario = {//crea el objeto
            usuario: nombre,//le asigna los valores
            password: password//le asigna los valores
        }
        fetch("https://censo.develotion.com/usuarios.php",
            {//hace el fetch
                method: "POST",//metodo post
                headers: {//le asigna los headers
                    "Content-Type": "application/json",//le asigna el tipo de contenido
                },
                body: JSON.stringify(datosUsuario)//le asigna el body
            })
            .then(response => {
                if (response.ok) {//si la respuesta es ok
                    CrearMensaje("Se ha registrado exitosamente");//muestra el mensaje
                    LoguearUsuarioAlRegistrarse(nombre, password);
                    return response.json();//devuelve la respuesta
                    //return LimpiarCamposRegistro();//limpia los campos
                } else {//si no es ok
                    return Promise.reject(response);//devuelve el error
                }
            })
            .then((data) => {//segun la respuesta
            })
            .catch((error) => {//si hay error
                CrearMensaje(error.message);
            });
    } catch (error) {//si hay error
        CrearMensaje(error.message)//muestra el mensaje
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
                data += `<option value="0">Seleccione un departamento</option>`;//le asigna el valor
                for (let i = 0; i < datosRespuesta.departamentos.length; i++) {//recorre el array de departamentos
                    data += `<option value="${datosRespuesta.departamentos[i].id}">${datosRespuesta.departamentos[i].nombre}</option>`;//le asigna el nombre del departamento
                }
                document.querySelector("#slcDepartamentoAgregarPersona").innerHTML = data;//lo agrega al select
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
                "apikey": apiKey,//le asigna el apikey
                "iduser": idUsuario//le asigna el id del usuario
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
                data += `<option value="0">Seleccione una ciudad</option>`;//le asigna el valor
                for (let i = 0; i < datosRespuesta.ciudades.length; i++) {//recorre el array de ciudades
                    data += `<option value="${datosRespuesta.ciudades[i].id}">${datosRespuesta.ciudades[i].nombre}</option>`;//le asigna el nombre de la ciudad
                }
                document.querySelector("#slcCiudadAgregarPersona").innerHTML = data;//lo agrega al select
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

        const currentDate = new Date();//toma la fecha actual
        const fechaNacimiento = new Date(fechaNac);//toma la fecha de nacimiento
        const edad = currentDate.getFullYear() - fechaNacimiento.getFullYear();//calcula la edad

        fetch("https://censo.develotion.com/ocupaciones.php", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": apiKey,//le asigna el apikey
                "iduser": idUsuario//le asigna el id del usuario
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
                data += `<option value="0">Seleccione una ocupacion</option>`;//le asigna el valor

                for (let i = 0; i < datosRespuesta.ocupaciones.length; i++) {//recorre el array de ciudades
                    if (edad < 18 && datosRespuesta.ocupaciones[i].id == 5) {//si es menor de edad y la ocupacion es estudiante
                        data += `<option value="${datosRespuesta.ocupaciones[i].id}">${datosRespuesta.ocupaciones[i].ocupacion}</option>`;//le asigna el nombre de la ocupacion
                    } else if (edad >= 18) {
                        data += `<option value="${datosRespuesta.ocupaciones[i].id}">${datosRespuesta.ocupaciones[i].ocupacion}</option>`;//le asigna el nombre de la ocupacion
                    }
                }
                document.querySelector("#slcOcupacionAgregarPersona").innerHTML = data;//lo agrega al select
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}
function CrearPersonaAgregar() {
    let idUsuario = localStorage.getItem("idUsuario");

    let nombre = document.querySelector("#nombrePersonaAgregar").value;//toma el valor del input
    let departamento = document.querySelector("#slcDepartamentoAgregarPersona").value;//toma el valor del input
    let ciudad = document.querySelector("#slcCiudadAgregarPersona").value;//toma el valor del input
    let fechaNacimiento = document.querySelector("#fechaNacPersonaAgregar").value;//toma el valor del input
    let ocupacion = document.querySelector("#slcOcupacionAgregarPersona").value;;//toma el valor del select

    let datosPersona = new Persona(idUsuario, nombre, departamento, ciudad, fechaNacimiento, ocupacion);//crea un objeto persona
    AgregarPersonaAPI(datosPersona);//lo agrega a la api
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
            .then(function (datosPersona) {
                document.querySelector("#pErrorAgregarPersona").innerHTML = "¡Persona agregada con exito!";//muestra el error
            })
            .catch(function (error) {//si hay error, lo muestra
                CrearMensaje(error.error)
            })
    }
}

/*SECCION VER PERSONAS*/
function CargarOcupacionesAarray() {
    if (localStorage.getItem("apiKey") != null) {
        //console.log(localStorage.getItem("idUsuario"));
        //const idUsuario = localStorage.getItem("idUsuario");
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
                /*ocupacionesArray = datosRespuesta;
                console.log(ocupacionesArray);*/
                for (let i = 0; i < datosRespuesta.ocupaciones.length; i++) {
                    const ocupacionData = datosRespuesta.ocupaciones[i];
                    const ocupacion = new Ocupacion(ocupacionData.id, ocupacionData.ocupacion);
                    ocupacionesArray.push(ocupacion);
                }
                CargarOcupacionesFiltro();
            })
            .catch(function (error) {
                //document.querySelector("#content-personas").innerHTML = error.error;//tira undefined revisar
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
                document.querySelector("#content-personas").innerHTML = error.error;//tira undefined revisar
            })
    }
}
function EliminarDatos(idPersona) {
    const apiKey = localStorage.getItem("apiKey");
    if (apiKey != null) {
        // Realizar la solicitud para eliminar la persona con el _id especificado
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
                    // Eliminación exitosa, puedes actualizar la lista de personas si lo deseas
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
    let data = "";//crea una variable vacia
    data += `<option value="0">Seleccione una ocupacion</option>`;//le asigna el valor

    for (let i = 0; i < ocupacionesArray.length; i++) {//recorre el array de ciudades

        data += `<option value="${ocupacionesArray[i].idOcupacion}">${ocupacionesArray[i].nombre}</option>`;//le asigna el nombre de la ocupacion
    }
    document.querySelector("#slcFiltroVerPersonas").innerHTML = data;//lo agrega al select
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
