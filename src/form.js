var btnRegisterU=document.getElementById("userForm")
var btnRegisterT=document.getElementById("trainerForm")
var btnReturnOption=document.getElementById("ReturnOption")
var questionTitle=document.getElementById("questionTitle")
var btnReturnToMainPage=document.getElementById("ReturnToMainPage")

var alertUsuario=document.getElementById("alertUsuario")
var alertCorreo=document.getElementById("alertCorreo")
var alertContraseña=document.getElementById("alertContraseña")
var alertVerificacion=document.getElementById("alertVerificacion")

function userForm(){
    document.getElementById("form_user").style.display='block'
    document.getElementById("form_trainer").style.display='none'
    btnRegisterU.style.display='none'
    btnRegisterT.style.display='none'
    questionTitle.style.display='none'
    btnReturnOption.style.display='block'
}
function trainerForm(){
    document.getElementById("form_trainer").style.display='block'
    document.getElementById("form_user").style.display='none'
    btnRegisterU.style.display='none'
    btnRegisterT.style.display='none'
    questionTitle.style.display='none'
    btnReturnOption.style.display='block'
}

function Return(){
    document.getElementById("form_user").style.display='none'
    document.getElementById("form_trainer").style.display='none'
    btnReturnOption.style.display='none'
    btnRegisterU.style.display='inline'
    btnRegisterT.style.display='inline'
    questionTitle.style.display='block'
}

function returnToMainPage(){
    window.location.assign("/")
}

btnRegisterU.addEventListener("click", userForm)
btnRegisterT.addEventListener("click", trainerForm)
btnReturnOption.addEventListener("click", Return)
btnReturnToMainPage.addEventListener("click", returnToMainPage)
