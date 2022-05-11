require("../Database/database")()
const conexion = conn()
let sql_level_access_user = `SELECT * FROM reg_user WHERE pass_u = "1"`
conexion.query(sql_level_access_user, (err)=>{
    if(err) throw err
    if(sql_level_access_user != "1"){
        window.location.assign("/")
    }else{
        let sql_level_access_trainer = `SELECT * FROM reg_trainer WHERE pass_u = "1"`
        conexion.query(sql_level_access_trainer, (err)=>{
            if(err) throw err
            if(sql_level_access_trainer != "1"){
                window.location.assign("/")
            }
        })
    }
})

