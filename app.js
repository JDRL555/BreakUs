require("./Database/database")()
const { ejecutarFuncion } = require("./functions/auto_increment")
require("dotenv").config()
const conexion = conn()
const express = require("express")
const session = require("express-session")
const app = express()
const port = 4000
const body = require("body-parser")
const bcrypt = require("bcrypt")
const ejs = require("ejs")
const path = require("path")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const { promisify } = require("util")

//middelwares:
app.set("views", path.join(__dirname, "/src"))
app.engine("ejs", ejs.__express)
app.set("view engine", "ejs")

app.use(express.static(__dirname + "/src"))
app.use(body.urlencoded({extended: true}))

app.use(cookieParser())

app.use(session({
    secret: '123',
    resave: true,
    saveUninitialized: true
}))

//Inicialización del servidor
app.listen(port, ()=>{
    console.log("Server running on port... http://localhost:"+ port)
})

//Rutas(get):
app.get("/", notAutenthicate, (req, res)=>{
    res.render("MainPage.ejs")
})

app.get("/Login", notAutenthicate, (req, res)=>{
    res.render("formL.ejs")
})

app.get("/Register", notAutenthicate, (req, res)=>{
    res.render("formR.ejs")
})

app.get("/PlanChoice", autenthicate_plan_choice, (req, res) =>{
    res.render("PlanChoice.ejs")
})

app.get("/UserPage", autenthicate, autenthicate_user, (req, res)=>{
    res.render("UserPage.ejs")
})

app.get("/TrainerPage", autenthicate, autenthicate_trainer, (req, res)=>{
    res.render("TrainerPage.ejs")
})

app.get("/logout_user", (req, res)=>{
    res.clearCookie("jwt_u")
    res.redirect("/")
})

app.get("/logout_trainer", (req, res)=>{
    res.clearCookie("jwt_t")
    res.redirect("/")
})

//Rutas(post):
app.post("/Registrar_Atleta", (req, res)=>{
    const nombresAtleta = req.body.nombresAtleta
    const apellidosAtleta = req.body.apellidosAtleta
    const usuarioAtleta = req.body.usuarioAtleta
    const correoAtleta = req.body.correoAtleta
    const claveAtleta = req.body.claveAtleta
    const verificacionAtleta = req.body.verificacionAtleta
    var expresion = /\w+@\w+\.+[a-z]/; 
    bcrypt.hash(claveAtleta, 10, (err, hash)=>{
        if(err){
            throw err
        }else{
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
                let sql = `INSERT INTO reg_user(name_u, lastName_u, user_u, email_u, psw_u, access_level_user) VALUES ("${nombresAtleta}","${apellidosAtleta}", "${usuarioAtleta}", "${correoAtleta}", "${hash}", "Atleta")`
                conexion.query(sql, (err)=>{
                    if(err) throw err
                    res.redirect("/Login")
                })
            }
        }
    })
})

app.post("/Registrar_Entrenador", (req, res)=>{
    const nombresEntrenador = req.body.nombresEntrenador
    const apellidosEntrenador = req.body.apellidosEntrenador
    const usuarioEntrenador = req.body.usuarioEntrenador
    const correoEntrenador = req.body.correoEntrenador
    const claveEntrenador = req.body.claveEntrenador
    const verificacionEntrenador = req.body.verificarEntrenador
    var expresion = /\w+@\w+\.+[a-z]/; 
    bcrypt.hash(claveEntrenador, 10, (err, hash)=>{
        if(err){
            throw err
        }else{
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
                let sql = `INSERT INTO reg_trainer(name_t, lastName_t, user_t, email_t, psw_t, access_level_trainer) VALUES ("${nombresEntrenador}","${apellidosEntrenador}", "${usuarioEntrenador}", "${correoEntrenador}", "${hash}", "Entrenador")`
                conexion.query(sql, (err)=>{
                    if(err) throw err
                    res.redirect("/Login")
                })
            }
        }
    })
})

app.post("/Iniciar_Sesion", (req, res)=>{
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
                            const idt = data[0].id_t
                            const token = jwt.sign({id: idt}, process.env.SECRET_WORD_TRAINER, {expiresIn: process.env.EXPIRE_JWT})
                            res.cookie("jwt_t", token)
                            conexion.query(`UPDATE reg_trainer SET pass_t = "${token}", time_t = NOW() WHERE id_t = "${idt}";`)
                            res.redirect("/TrainerPage")
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
                    const idu = data[0].id_u
                    const token = jwt.sign({id: idu}, process.env.SECRET_WORD_USER, {expiresIn: process.env.EXPIRE_JWT})
                    res.cookie("jwt_u", token)
                    conexion.query(`UPDATE reg_user SET pass_u = "${token}", time_u = NOW() WHERE id_u = "${idu}";`)
                    res.redirect("/PlanChoice")
                }
            })
        }
    })
})

app.get("/plan_novato", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                conexion.query(`INSERT INTO plan_choice(id_u, plan_type) VALUES("${verification.id}", "NOVATO")`)
                res.redirect("/UserPage")
            }else{
                res.redirect("/UserPage")
            }
        })
    }else{
        console.log("No funciono xd")
    }
})

app.get("/plan_intermedio", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                conexion.query(`INSERT INTO plan_choice(id_u, plan_type) VALUES("${verification.id}", "INTERMEDIO")`)
                res.redirect("/UserPage")
            }else{
                res.redirect("/UserPage")
            }
        })
    }else{
        console.log("No funciono xd")
    }
})

app.get("/plan_avanzado", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                conexion.query(`INSERT INTO plan_choice(id_u, plan_type) VALUES("${verification.id}", "AVANZADO")`)
                res.redirect("/UserPage")
            }else{
                res.redirect("/UserPage")
            }
        })
    }else{
        console.log("No funciono xd")
    }
})

app.post("/TrainerPage/newRoutine", (req, res)=>{
    const verification = jwt.verify(req.cookies.jwt, process.env.SECRET_WORD)
    
    // const {exercise1, exercise2, exercise3, exercise4, exercise5, exercise6, exercise7, exercise8, exercise9, exercise10} = req.body
    // conexion.query(`INSERT INTO routines_novato(exercies1, exercies2, exercies3, exercies4, exercies5, exercies6, exercies7, exercies8, exercies9, exercies10) VALUES("${exercise1}", "${exercise2}", "${exercise3}", "${exercise4}", "${exercise5}", "${exercise6}", "${exercise7}", "${exercise8}", "${exercise9}", "${exercise10}");`, (err, data)=>{
    // })
})

function autenthicate(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}";`, (err, data)=>{
            if(data[0] == undefined){
                console.log("El atleta no tiene permiso")
            }else{
                console.log("Bienvenido atleta uwu")
                return next()
            }
        })
    }else{
        if(req.cookies.jwt_t){
            const verification = jwt.verify(req.cookies.jwt_t, process.env.SECRET_WORD_TRAINER)
            conexion.query(`SELECT * FROM reg_trainer WHERE id_t = "${verification.id}";`, (err, data)=>{
                if(data[0] == undefined){
                    console.log("El entrenador no tiene permiso")
                }else{
                    console.log("Bienvenido entrenador uwu")
                    return next()
                }
            })
        }else{
            console.log(".i.")
            res.redirect("/")
        }
    }
}

function notAutenthicate(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}";`, (err, data)=>{
            if(data[0] == undefined){
                return next()
            }else{
                res.redirect("/UserPage")
            }
        })
    }else{
        if(req.cookies.jwt_t){
            const verification = jwt.verify(req.cookies.jwt_t, process.env.SECRET_WORD_TRAINER)
            conexion.query(`SELECT * FROM reg_trainer WHERE id_t = "${verification.id}"`, (err, data)=>{
                if(data[0] == undefined){
                    return next()
                }else{
                    res.redirect("/TrainerPage")
                }
            })
        }else{
            return next()
        }
    }
}

function autenthicate_plan_choice(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                return next()
            }else{
                res.redirect("/UserPage")
            }
        })
    }else{
        res.redirect("/")
    }
}

function autenthicate_user(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                res.redirect("/TrainerPage")
            }else{
                return next()
            }
        })
    }else{
        res.redirect("/TrainerPage")
    }
}

function autenthicate_trainer(req, res, next){
    if(req.cookies.jwt_t){
        const verification = jwt.verify(req.cookies.jwt_t, process.env.SECRET_WORD_TRAINER)
        conexion.query(`SELECT * FROM reg_trainer WHERE id_t = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                res.redirect("/UserPage")
            }else{
                return next()
            }
        })
    }else{
        res.redirect("/UserPage")
    }
    
}

