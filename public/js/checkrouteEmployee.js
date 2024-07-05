const urlActual = window.location.pathname.split("/");
const addVoluntario = document.getElementById("seccion1");
const addRepresentante = document.getElementById("seccion2");
const changeFilial = document.getElementById("seccion3");

const intercambiosRepresentante = document.getElementById("seccion4");
const intercambiosVoluntario = document.getElementById("seccion5");
const historyDonations = document.getElementById("seccion6");
const cashDonations = document.getElementById("seccion7");
const articleDonations = document.getElementById("seccion8");
let change;

if (urlActual[2] == "registerVoluntario") change = addVoluntario;
else if (urlActual[2] =="registerRepresentante") change = addRepresentante;
else if (urlActual[2] == "changeFilial") change = changeFilial;
else if (urlActual[2] == "historyExchanges") change = intercambiosRepresentante;
else if (urlActual[2] == "exchanges") change = intercambiosVoluntario;
else if (urlActual[2] == "historyDonations") change = historyDonations;
else if (urlActual[2] == "cashDonations") change = cashDonations;
else if (urlActual[2] == "articleDonations") change = articleDonations;
change.classList.add("action-seleccionado");