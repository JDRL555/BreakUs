//Dependencias
require("./Database/database")()
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
const { vary } = require("express/lib/response")

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

//Inicialización del servidor:
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

app.get("/UserPage", autenthicate, autenthicate_user, hi_user, (req, res)=>{
    res.render("UserPage.ejs")
})

app.get("/TrainerPage", autenthicate, autenthicate_trainer, hi_trainer, (req, res)=>{
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

app.get("/plan_novato_edit", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                console.log("no xd")
            }else{
                conexion.query(`UPDATE plan_choice SET plan_type = "NOVATO" WHERE id_u = "${verification.id}"`)
                console.log("Modificacion a novato exitosa n.n")
                res.redirect("/UserPage")
            }
        })
    }
})

app.get("/plan_intermedio_edit", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                console.log("no xd")
            }else{
                conexion.query(`UPDATE plan_choice SET plan_type = "INTERMEDIO" WHERE id_u = "${verification.id}"`)
                console.log("Modificacion a intermedio exitosa n.n")
                res.redirect("/UserPage")
            }
        })
    }
})

app.get("/plan_avanzado_edit", (req, res)=>{
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(data[0] == undefined){
                console.log("no xd")
            }else{
                conexion.query(`UPDATE plan_choice SET plan_type = "AVANZADO" WHERE id_u = "${verification.id}"`)
                console.log("Modificacion a avanzado exitosa n.n")
                res.redirect("/UserPage")
            }
        })
    }
})

app.get("/complete_routine", (req, res)=>{
    const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
    conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}"`, (err, data)=>{
        if(err) throw err
        const idu = data[0].id_u
        conexion.query(`SELECT id_plan FROM plan_choice WHERE id_u = "${idu}"`, (err, data)=>{
            if(err) throw err
            const idp = data[0].id_plan
            conexion.query(`INSERT INTO routines_u (id_u, id_plan) VALUES ("${idu}", "${idp}")`)
            console.log("Rutina ejecutada exitosamente")
        })
    })
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
                let sql = `INSERT INTO reg_user(name_u, lastName_u, user_u, email_u, psw_u, access_level_user, time_u) VALUES ("${nombresAtleta}","${apellidosAtleta}", "${usuarioAtleta}", "${correoAtleta}", "${hash}", "Atleta", NOW())`
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
                let sql = `INSERT INTO reg_trainer(name_t, lastName_t, user_t, email_t, psw_t, access_level_trainer, time_t) VALUES ("${nombresEntrenador}","${apellidosEntrenador}", "${usuarioEntrenador}", "${correoEntrenador}", "${hash}", "Entrenador", NOW())`
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
                            conexion.query(`UPDATE reg_trainer SET pass_t = "${token}" WHERE id_t = "${idt}";`)
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

app.post("/TrainerPage/newRoutine", (req, res)=>{
    const {exercise1, exercise2, exercise3, exercise4, exercise5, exercise6, exercise7, exercise8, exercise9, exercise10} = req.body
    const new_user = req.body.new_user
    if(!exercise1 || !exercise2 || !exercise3 || !exercise4 || !exercise5 || !exercise6 || !exercise7 || !exercise8 || !exercise9 || !exercise10 || !new_user){
        res.send("Complete los datos para continuar")
    }else{
        conexion.query(`SELECT * FROM reg_user WHERE user_u = "${new_user}"`, (err, data)=>{
            if(data[0] == undefined)
            throw err
            console.log(data[0].id_u)
            conexion.query(`SELECT * FROM plan_choice WHERE id_u = "${data[0].id_u}"`, (err, data)=>{
                if(err)
                console.log(data[0].id_plan)
                const idplan = data[0].id_plan
                conexion.query(`SELECT * FROM plan_choice WHERE id_plan = "${idplan}"`, (err, data)=>{
                    if(err) throw err
                    const plan_tipo = data[0].plan_type
                    const verification = jwt.verify(req.cookies.jwt_t, process.env.SECRET_WORD_TRAINER)
                    
                    if(plan_tipo=="NOVATO"){
                        conexion.query(`INSERT INTO routines_novato (id_t, id_plan, exercies1, exercies2, exercies3, exercies4, exercies5, exercies6, exercies7, exercies8, exercies9, exercies10) VALUES ("${verification.id}", "${idplan}", "${exercise1}", "${exercise2}", "${exercise3}", "${exercise4}", "${exercise5}", "${exercise6}", "${exercise7}", "${exercise8}", "${exercise9}", "${exercise10}");`)
                        res.send("Rutina agregada a novato:D")
                    }else if(plan_tipo=="INTERMEDIO"){
                        conexion.query(`INSERT INTO routines_intermedio (id_t, id_plan, exercies1, exercies2, exercies3, exercies4, exercies5, exercies6, exercies7, exercies8, exercies9, exercies10) VALUES ("${verification.id}", "${idplan}", "${exercise1}", "${exercise2}", "${exercise3}", "${exercise4}", "${exercise5}", "${exercise6}", "${exercise7}", "${exercise8}", "${exercise9}", "${exercise10}");`)
                        res.send("Rutina agregada a intermedio:D")
                    }else if(plan_tipo=="AVANZADO"){
                        conexion.query(`INSERT INTO routines_avanzado (id_t, id_plan, exercies1, exercies2, exercies3, exercies4, exercies5, exercies6, exercies7, exercies8, exercies9, exercies10) VALUES ("${verification.id}", "${idplan}", "${exercise1}", "${exercise2}", "${exercise3}", "${exercise4}", "${exercise5}", "${exercise6}", "${exercise7}", "${exercise8}", "${exercise9}", "${exercise10}");`)
                        res.send("Rutina agregada a avanzado:D")
                    }
                })
            })
        })
    }
})

//Funciones adicionales:
function autenthicate(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}";`, (err, data)=>{
            if(data[0] == undefined){
                console.log("El atleta no tiene permiso")
            }else{
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
                    return next()
                }
            })
        }else{
            console.log("No estas registrado, por ende no tienes acceso a ninguno de estos sitios")
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

function hi_user(req, res, next){
    if(req.cookies.jwt_u){
        const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
        conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}"`, (err, data)=>{
            if(err) throw err
            conexion.query(`SELECT hi_user("${data[0].user_u}")`, (err, data)=>{
                console.log(data[0])
            })
            return next()
        })
    }
}

function hi_trainer(req, res, next){
    if(req.cookies.jwt_t){
        const verification = jwt.verify(req.cookies.jwt_t, process.env.SECRET_WORD_TRAINER)
        conexion.query(`SELECT * FROM reg_trainer WHERE id_t = "${verification.id}"`, (err, data)=>{
            if(err) throw err
            conexion.query(`SELECT hi_trainer("${data[0].user_t}")`, (err, data)=>{
                console.log(data[0])
            })
            return next()
        })
    }
}

// function show_data_user(req, res, next){
//     if(req. cookies.jwt_u){
//         const verification = jwt.verify(req.cookies.jwt_u, process.env.SECRET_WORD_USER)
//         conexion.query(`SELECT * FROM reg_user WHERE id_u = "${verification.id}";`, (err, data)=>{
//             const name = data[0].name_u
//             const lastName = data[0].lastName_u
//             const user = data[0].user_u
//             const email = data[0].email_u
            
//             var datos = {
//                 name: name,
//                 lastName: lastName,
//                 user: user,
//                 email: email
//             }
//             res.render('UserPage', {
//                 datos: datos
//             })
//             return next()
//         })
//     }else{
//         return next()
//     }
// }

