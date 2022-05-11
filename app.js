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

server.post("/Registrar_Atleta", (req, res)=>{
    const nombresAtleta = req.body.nombresAtleta
    const apellidosAtleta = req.body.apellidosAtleta
    const usuarioAtleta = req.body.usuarioAtleta
    const correoAtleta = req.body.correoAtleta
    const claveAtleta = req.body.claveAtleta
    const verificacionAtleta = req.body.verificacionAtleta
    const fecha = new Date() 
    bcrypt.hash(claveAtleta, 10, (err, hash)=>{
        if(err) throw err
        let sql = `INSERT INTO reg_user(name_u, lastName_u, user_u, email_u, psw_u, access_level_user, pass_u, time_u) VALUES ("${nombresAtleta}","${apellidosAtleta}", "${usuarioAtleta}", "${correoAtleta}", "${hash}", "Atleta", "1", "${fecha}")`
        conexion.query(sql, ()=>{
            if(!nombresAtleta || !apellidosAtleta || !usuarioAtleta || !correoAtleta || !claveAtleta){
                res.send("Por favor llene los campos para continuar")
            }else{
                res.send("Registrado uwu")
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
    bcrypt.hash(claveEntrenador, 10, (err, hash)=>{
        if(err) throw err
        let sql = `INSERT INTO reg_trainer(name_t, lastName_t, user_t, email_t, psw_t, access_level_trainer, pass_t, time_t) VALUES ("${nombresEntrenador}","${apellidosEntrenador}", "${usuarioEntrenador}", "${correoEntrenador}", "${hash}", "Entrenador", "1", "${fecha}")`
        conexion.query(sql, ()=>{
            if(!nombresAtleta || !apellidosAtleta || !usuarioAtleta || !correoAtleta || !claveAtleta){
                res.send("Por favor llene los campos para continuar")
            }else{
                res.send("Registrado uwu")
            }
        })
    })
})

server.post("/Iniciar_Sesion_Atleta", (req, res)=>{
    const usuarioLoginA = req.body.usuarioLoginA
    const claveLoginA = req.body.claveLoginA
    let sql = `SELECT * FROM reg_user WHERE user_u = "${usuarioLoginA}";`
    conexion.query(sql, (err, data)=>{
        if(err) throw err 
        bcrypt.compare(claveLoginA, data[0].psw_u, (err, res)=>{
            if(!res){
                console.log("Contraseña incorrecta")
                console.log(usuarioLoginA, res, data[0].psw_u, claveLoginA)
            }
        })
        res.redirect("/PlanChoice")
    })
})