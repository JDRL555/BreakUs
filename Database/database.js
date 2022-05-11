module.exports = function(){
    this.conn = function(err){
        const mysql = require("mysql")
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            psw: "",
            database: "breakus_database"
        })
        if(err) throw err
        console.log("Conexion exitosa con la base de datos uwu")
        return conn
    }
}