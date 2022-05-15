require("../Database/database")()
const conexion = conn()
var auto = 0

function funcion(){
    conexion.query(`
    DELIMITER .
    CREATE FUNCTION autoIncrement()
    RETURNS INT
    BEGIN
        RETURN "${auto}" + 1;
    END .
    DELIMITER ;`)
}


function ejecutarFuncion(){
   conexion.query(`SELECT id_plan FROM plan_choice`, (err, data)=>{
       console.log(data)
   })
}

module.exports = { ejecutarFuncion }