const nodemailer = require('nodemailer');
const passGoogle = require('../authGoogle');
const Notificacion = require('./database/models/Notificacion');


// Configuración del transporte
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "hopetrade.lp@gmail.com",
      pass: passGoogle,
    },
  });
  
const sendToMail = (mail, asunto, texto) => {
    try {
        let mailOptions = {
            from: 'hopetrade.lp@gmail.com', // Dirección del remitente
            to: mail, // Dirección del destinatario
            subject: asunto,
            text: texto
        };
    
        // Enviar el correo electrónico
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.log('Error al enviar el correo: ' + error);
            else console.log('Correo enviado: ' + info.response);
        });
    } catch (error) {
        console.log(error);
    }
}

const createNotification = async (id, contenidoParam, tipoParam) => {
    try {
        await Notificacion.create({
            usuario_id: id,
            contenido: contenidoParam,
            tipo: tipoParam
        });
    } catch (error) {
        console.log(error);
    }

}

const sendNotificationToMail = (mail, asunto, id, contenido, tipo) => {
    createNotification(id, contenido, tipo);
    sendToMail(mail, asunto, contenido);
}


//el formato de fechas es YYYY-MM-DD, .toLocaleDateString() retorna DD/MM/YYYY, incluso puede q el mes (o dia) sea de un solo digito asi q hay q ponerle el 0 delante
const changeDateFormat = f => {
    let fecha = f.toLocaleDateString().split("/");
    if(fecha[0].length == 1) fecha[0] = `0${fecha[0]}`
    if(fecha[1].length == 1) fecha[1] = `0${fecha[1]}`
    return fecha.reverse().join("-");
}


module.exports = {sendToMail , createNotification, sendNotificationToMail, changeDateFormat};