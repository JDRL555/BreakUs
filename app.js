require("./Database/database")()
const conexion = conn()
const express = require("express")
const server = express()
const port = 4000
const body = require("body-parser")
const bcrypt = require("bcrypt")
const ejs = require("ejs")
const path = require("path")

server.set("views", path.join(__dirname, "/src"))
server.engine("ejs", ejs.__express)
server.set("view engine", "ejs")

server.use(express.static(__dirname + "/src"))
server.use(body.urlencoded({extended: true}))

server.listen(port, ()=>{
    console.log("Server running on port... http://localhost:"+ port)
})

server.get("/", (req, res)=>{
    res.render("MainPage.ejs")
})

server.get("/Login", (req, res)=>{
    res.render("formL.ejs")
})

server.get("/Register", (req, res)=>{
    res.render("formR.ejs")
})

server.get("/PlanChoice", (req, res) =>{
    res.render("PlanChoice.ejs")
})

server.get("/ProfilePage", (req, res)=>{
    res.render("ProfilePage.ejs")
})

server.post("/Registrar_Atleta", (req, res)=>{
    const nombresAtleta = req.body.nombresAtleta
    const apellidosAtleta = req.body.apellidosAtleta
    const usuarioAtleta = req.body.usuarioAtleta
    const correoAtleta = req.body.correoAtleta
    const claveAtleta = req.body.claveAtleta
    const verificacionAtleta = req.body.verificacionAtleta
    const fecha = new Date()
    var expresion = /\w+@\w+\.+[a-z]/; 
    bcrypt.hash(claveAtleta, 10, (err, hash)=>{
        if(err) throw err
        let sql = `INSERT INTO reg_user(name_u, lastName_u, user_u, email_u, psw_u, access_level_user, pass_u, time_u) VALUES ("${nombresAtleta}","${apellidosAtleta}", "${usuarioAtleta}", "${correoAtleta}", "${hash}", "Atleta", "1", "${fecha}")`
        conexion.query(sql, ()=>{
            if(!nombresAtleta||!apellidosAtleta||!usuarioAtleta||!correoAtleta||!claveAtleta||!verificacionAtleta){
                res.send("Complete los datos para continuar")
            }
            else if(usuarioAtleta.length<5){
                res.send("El usuario debe contener por lo menos 5 caracteres")
            }
            else if(claveAtleta.length<10){
                res.send("La contraseña debe contener por lo menos 10 caracteres")
            }
            else if(!expresion.test(correoAtleta)){
                res.send("Correo inválido")
            }
            else if(claveAtleta!=verificacionAtleta){
                res.send("Las contraseñas no coinciden")
            }else{
                res.send("Usuario Registrado")
            }
        })
    })
})

server.post("/Registrar_Entrenador", (req, res)=>{
    const nombresEntrenador = req.body.nombresEntrenador
    const apellidosEntrenador = req.body.apellidosEntrenador
    const usuarioEntrenador = req.body.usuarioEntrenador
    const correoEntrenador = req.body.correoEntrenador
    const claveEntrenador = req.body.claveEntrenador
    const verificacionEntrenador = req.body.verificarEntrenador
    const fecha = new Date()
    var expresion = /\w+@\w+\.+[a-z]/; 
    bcrypt.hash(claveEntrenador, 10, (err, hash)=>{
        if(err) throw err
        let sql = `INSERT INTO reg_trainer(name_t, lastName_t, user_t, email_t, psw_t, access_level_trainer, pass_t, time_t) VALUES ("${nombresEntrenador}","${apellidosEntrenador}", "${usuarioEntrenador}", "${correoEntrenador}", "${hash}", "Entrenador", "1", "${fecha}")`
        conexion.query(sql, ()=>{
            if(!nombresEntrenador||!apellidosEntrenador||!usuarioEntrenador||!correoEntrenador||!claveEntrenador||!verificacionEntrenador){
                res.send("Complete los datos para continuar")
            }
            else if(usuarioEntrenador.length<5){
                res.send("El usuario debe contener por lo menos 5 caracteres")
            }
            else if(claveEntrenador.length<10){
                res.send("La contraseña debe contener por lo menos 10 caracteres")
            }
            else if(!expresion.test(correoEntrenador)){
                res.send("Correo inválido")
            }
            else if(claveEntrenador!=verificacionEntrenador){
                res.send("Las contraseñas no coinciden")
            }
            else{
                res.send("Usuario Registrado")
            }
        })
    })
})

server.post("/Iniciar_Sesion", (req, res)=>{
    const usuarioLoginA = req.body.usuarioLoginA
    const claveLoginA = req.body.claveLoginA
    let sql1 = `SELECT * FROM reg_user WHERE user_u = "${usuarioLoginA}";`
    conexion.query(sql1, (err, data)=>{
        if(data[0] == undefined){
            console.log("Atleta no registrado")
            let sql2 = `SELECT * FROM reg_trainer WHERE user_t = "${usuarioLoginA}";`
            conexion.query(sql2, (err, data)=>{
                if(data[0] == undefined){
                    console.log("Entrenador no registrado")
                }else{
                    bcrypt.compare(claveLoginA, data[0].psw_t, (err)=>{
                        if(err){
                            console.log("Contraseña del entrenador incorrecta")
                        }else{
                            console.log("Entrenador veradero")
                            res.redirect("/PlanChoice")
                        }
                    })
                }
            })
        }else{
            bcrypt.compare(claveLoginA, data[0].psw_u, (err)=>{
                if(err){
                    console.log("Contraseña del atleta incorrecta")
                }else{
                    console.log("Atleta veradero")
                    res.redirect("/PlanChoice")
                }
            })
        }
    })
})