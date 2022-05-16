require("../Database/database")()
const conexion = conn()

function hi_user(){
    conexion.query(`
    DELIMITER .
    CREATE FUNCTION hi_user(user VARCHAR(50))
    RETURNS VARCHAR(50)
    BEGIN 
        RETURN CONCAT("Bienvenido, ", user);
    END .
    DELIMITER ;`)
}

function hi_trainer(){
    conexion.query(`
    DELIMITER .
    CREATE FUNCTION hi_trainer(trainer VARCHAR(50))
    RETURNS VARCHAR(50)
    BEGIN 
        RETURN CONCAT("Bienvenido, ", trainer);
    END .
    DELIMITER ;`)
}