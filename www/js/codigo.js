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
    /*let hayUsuarioLogueado = false;
    let token;*/
    //inicializar();//inicializa la pagina
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