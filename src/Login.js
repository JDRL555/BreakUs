let btnL = document.getElementById("btnLogin")

function LoginEstandar(){
    let userLogin = document.getElementById("userLogin").value
    let passwordLogin = document.getElementById("passwordLogin").value
    
    if(!userLogin || !passwordLogin){
        alert("Complete los datos para continuar")
        return false
    }
    else if(userLogin!=window.localStorage.getItem("Usuario_Estandar")){
        alert("El usuario es incorrecto o no creo un usuario estandar, intentelo nuevamente")
        return false
    }
    else if(CryptoJS.MD5(passwordLogin)!=window.localStorage.getItem("Clave_Estandar")){
        alert("La clave es incorrecta o no creo una clave estandar, intentelo nuevamente")
        return false
    }
    else{
        window.localStorage.setItem("nivel_acceso_estandar", "creado")
        window.localStorage.setItem("fechaDeInicio", Date())
        alert("Bienvenido "+userLogin)
        window.location.assign("PlanChoice.html")
    }
}

function LoginAdmin(){
    let userLogin = document.getElementById("userLogin").value
    let passwordLogin = document.getElementById("passwordLogin").value
    
    if(!userLogin || !passwordLogin){
        alert("Complete los datos para continuar")
        return false
    }
    else if(userLogin!=window.localStorage.getItem("Usuario_Admin")){
        alert("El usuario es incorrecto o no creo un usuario administrador, intentelo nuevamente")
        return false
    }
    else if(CryptoJS.MD5(passwordLogin)!=window.localStorage.getItem("Clave_Admin")){
        alert("La clave es incorrecta o no creo una clave administrador, intentelo nuevamente")
        return false
    }
    else{
        window.localStorage.setItem("nivel_acceso_administrador", "creado")
        window.localStorage.setItem("fechaDeInicio", Date())
        alert("Bienvenido "+userLogin)
        window.location.assign("PlanChoice.html")
    }
}
btnL.addEventListener("click", LoginEstandar)
btnL.addEventListener("click", LoginAdmin)