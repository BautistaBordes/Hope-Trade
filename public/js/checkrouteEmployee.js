const urlActual = window.location.pathname.split("/");
const addVoluntario = document.getElementById("seccion1");
const addRepresentante = document.getElementById("seccion2");
const changeFilial = document.getElementById("seccion3");
let change;

console.log(urlActual)
if (urlActual[2] == "registerVoluntario") change = addVoluntario;
else if (urlActual[2] =="registerRepresentante") change = addRepresentante;
else if (urlActual[2] == "changeFilial") change = changeFilial;
change.classList.add("action-seleccionado");