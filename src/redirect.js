var btn1 = document.getElementById("btn1")
var btn2 = document.getElementById("btn2")

function RedirectToRegister(){
    window.location.assign("/Register")
}

function RedirectToLogin(){
    window.location.assign("/Login")
}
btn1.addEventListener("click", RedirectToRegister)
btn2.addEventListener("click", RedirectToLogin)
