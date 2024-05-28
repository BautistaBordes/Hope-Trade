const Usuario = require('./models/Usuario')
const Publicacion = require('./models/Publicacion')
const Filial = require('./models/Filial')
const Voluntario = require('./models/Voluntario')
const Categoria = require('./models/Categoria')
const Oferta = require('./models/Oferta')
const Intercambio = require('./models/Intercambio')
const Notificacion = require('./models/Notificacion')

//A.belongsTo(B) el a tiene la FK
//A.hasOne(B) el b tiene la FK

//un usuario comun pertenece/es un usuario
//ademas debo aclarar como es el campo que tiene la FK en mi tabla, xq hace la asociacion con el nombre del modelo en CamelCase
//ej: UserId y yo lo tengo declarado en la bd como "usuario_id"
// UsuarioComun.belongsTo(Usuario, {foreignKey: "usuario_id"});
// Usuario.hasOne(UsuarioComun);
Publicacion.belongsTo(Usuario, {foreignKey: "usuario_id"});
Publicacion.belongsTo(Categoria, {foreignKey: "categoria_id"});
Voluntario.belongsTo(Filial, {foreignKey: "filial_id"});

Oferta.belongsTo(Publicacion, {foreignKey: "publicacion_id"});
Oferta.belongsTo(Categoria, {foreignKey: "categoria_id"});
Oferta.belongsTo(Usuario, {foreignKey: "usuario_id"});
Oferta.belongsTo(Filial, {foreignKey: "filial_id"});

Intercambio.belongsTo(Publicacion, {foreignKey: "publicacion_id"});
Intercambio.belongsTo(Oferta, {foreignKey: "oferta_id"});


Notificacion.belongsTo(Usuario, {foreignKey: "usuario_id"});