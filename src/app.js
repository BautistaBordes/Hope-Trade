const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const PORT = 8080;

//aca seteas en que carpeta tenes todos archivos que no van a cambiar (podes agregar o eliminar, pero no modificar un file)
app.use(express.static("public"));

//util para formularios, oarsea a un formato valido el (req.body) para poder manejarlo en el codigo
//antes era con bodyparser (deprecado ahora)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//util para mantener informacion en el navegador
app.use(session({
  secret: "shh",
  resave: false,
  saveUninitialized: false
}))

// set our default template engine to "ejs"
// which prevents the need for using file extensions
app.set("view engine", "ejs");

// setea las vistas, lo que esta entre [] indica en que carpeta estan
app.set("views", [path.join(__dirname, 'views')]);

const frontBackMiddleware = require("./middlewares/frontBackMiddleware")

app.use(frontBackMiddleware)

//importas las rutas que va a usar en la app
const rutaMain = require("./routes/main")
const rutaUsers = require("./routes/users")

//aca estas diciendo que tu app va a poder entender y ejecutar lo que le pasas (puntualmente resuelve rutas)
app.use(rutaMain);
app.use(rutaUsers);


//ruta no existente
app.use( (req, res, next) => {
  res.status(404).send('no existe esa pagina');
});
//problema en la pagina
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('se rompio todo');
});


// arranca el servidor
app.listen(PORT, () => {
    console.log(`funca bien pa, ${PORT} server personal`);
})