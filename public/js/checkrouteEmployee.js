const urlActual = window.location.pathname.split("/");
const addVoluntario = document.getElementById("seccion1");
const addRepresentante = document.getElementById("seccion2");
const changeFilial = document.getElementById("seccion3");
const intercambios = document.getElementById("seccion4");
let change;

if (urlActual[2] == "registerVoluntario") change = addVoluntario;
else if (urlActual[2] =="registerRepresentante") change = addRepresentante;
else if (urlActual[2] == "changeFilial") change = changeFilial;
else if (urlActual[2] == "exchanges") change = intercambios;
change.classList.add("action-seleccionado");