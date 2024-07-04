const { changeDateFormat } = require('../globals')


const getTodayOrTomorrow = () => {
    let fecha = new Date();
    let horario = fecha.toLocaleTimeString().slice(0,-3); //guardo horario local y le saco los segundos 19:30:23 -> 19:30
    if(horario >= "20:00") fecha.setDate(fecha.getDate() + 1); //si llega al caso limite le suma un dia, si es el ultimo dia del mes pasa al 1ero del siguiente
    return changeDateFormat(fecha); //me devuelve la fecha en un string con formato valido

}

const controlador = {
    donate:(req, res) =>{
        res.render("donations/index");
    },
    donateProccess: async (req, res) =>{
        const result = validationResult(req);
    

        if(result.errors.length > 0){
            //en caso de que haya errores por los campos de texto la imagen se crea igual, asi q la elimino (si es q envian una)
            if(req.file) fs.unlinkSync(req.file.path);
            return res.render("donations/index", {
                errors: result.mapped(),
                oldData: req.body,
            });
        }
        
        await Donacion.create({
            
        })

        res.redirect("/")
    }

}

module.exports = controlador;