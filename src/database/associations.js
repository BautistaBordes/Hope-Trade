const Usuario = require('./models/Usuario')
// const UsuarioComun = require('./models/UsuarioComun')

//A.belongsTo(B) el a tiene la FK
//A.hasOne(B) el b tiene la FK

//un usuario comun pertenece/es un usuario
//ademas debo aclarar como es el campo que tiene la FK en mi tabla, xq hace la asociacion con el nombre del modelo en CamelCase
//ej: UserId y yo lo tengo declarado en la bd como "usuario_id"
// UsuarioComun.belongsTo(Usuario, {foreignKey: "usuario_id"});
// Usuario.hasOne(UsuarioComun);