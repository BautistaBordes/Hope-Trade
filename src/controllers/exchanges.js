
const { createNotification, sendNotificationToMail, changeDateFormat } = require('../globals')
const Publicacion = require("../database/models/Publicacion");
const Usuario = require("../database/models/Usuario");
const Oferta = require("../database/models/Oferta");
const Intercambio = require("../database/models/Intercambio");


const getTodayOrTomorrow = () => {
    let fecha = new Date();
    let horario = fecha.toLocaleTimeString().slice(0,-3); //guardo horario local y le saco los segundos 19:30:23 -> 19:30
    if(horario >= "20:00") fecha.setDate(fecha.getDate() + 1); //si llega al caso limite le suma un dia, si es el ultimo dia del mes pasa al 1ero del siguiente
    return changeDateFormat(fecha); //me devuelve la fecha en un string con formato valido

}


const controlador = {
    acceptExchange: async (req, res) => {
        const idURL = req.params.id;
        const referer = req.get('Referer');

        //puedo aceptar un intercambio si es uno que 1_existe 2_esta en la filial donde trabajo yo
        const intercambio = await Intercambio.findOne({
            include: [ {model: Oferta, where: {filial_id: req.session.usuario.filial_id } } ], 
            where: { id: idURL } 
        });


        res.send( `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Page Not Found</title>
            <script>
                setTimeout(() => {
                    window.location.href = "${referer}";
                }, 5000);
            </script>
        </head>
        <body>
            <p>llegaste bien</p>
        </body>
        </html>
        `)
    },
    rejectExchange: async (req, res) => {
        const idURL = req.params.id;
        const referer = req.get('Referer');

        const intercambio = await Intercambio.findOne({
            include: [ {model: Oferta, where: {filial_id: req.session.usuario.filial_id } } ], 
            where: { id: idURL } 
        });

        console.log(intercambio)

        res.status(200).send("llegaste bien");
    }
}

module.exports = controlador;