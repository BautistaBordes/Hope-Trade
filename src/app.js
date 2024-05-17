const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const PORT = 8080;
const db = require('./database/index');

const connectAndSync = async () => {
  try {
    //esto es para iniciar la conexion con la bd
    await db.authenticate();
    //esto es para sincronizar TODOS los modelos definidos (carpeta models) con las tablas de la BD
    await db.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    //error mas comun: ConnectionRefusedError, no levantaste la bd con xxamp
  }
};

//si no agrego esto no se contemplan las asociaciones 
require('./database/associations');
connectAndSync();


//aca seteas en que carpeta tenes todos archivos que no van a cambiar (podes agregar o eliminar, pero no modificar un file)
app.use(express.static("public"));
app.use(express.static("uploads"));

//util para formularios, oarsea a un formato valido el (req.body) para poder manejarlo en el codigo
//antes era con bodyparser (deprecado ahora)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//util para mantener informacion en el navegador
app.use(session({
  secret: "shh",
  resave: false,
  saveUninitialized: false,
  // cookie: {
  //   maxAge:  10 * 1000 //con esto digo por cuanto tiempo quiero que dure, sino queda hasta que cierras el navegador
  // }
}))

// set our default template engine to "ejs"
// which prevents the need for using file extensions
app.set("view engine", "ejs");

// setea las vistas, lo que esta entre [] indica en que carpeta estan
app.set("views", [path.join(__dirname, 'views')]);

const backToFrontMiddleware = require("./middlewares/backToFrontMiddleware")

app.use(backToFrontMiddleware)

//importas las rutas que va a usar en la app
const rutaMain = require("./routes/main")
const rutaUsers = require("./routes/users")
const rutaPosts = require("./routes/posts")

//aca estas diciendo que tu app va a poder entender y ejecutar lo que le pasas (puntualmente resuelve rutas)
app.use(rutaMain);
app.use(rutaUsers);
app.use(rutaPosts);


//ruta no existente
app.use( (req, res, next) => {
  if(res.locals.usuario && res.locals.usuario.rol === "representante") res.status(404).send('no existe esa pagina');
  else res.redirect("/");
});
//problema en la pagina
app.use((err, req, res, next) => {
  console.error(err.stack);
  if(res.locals.usuario && res.locals.usuario.rol === "representante") res.status(500).send('se rompio todo');
  else res.redirect("/");
});

// arranca el servidor
app.listen(PORT, () => {
    console.log(`aplicacion funcionando en el puerto ${PORT}, server personal`);
})