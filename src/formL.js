var btnReturnToMainPage=document.getElementById("ReturnToMainPage")
var btnGoToRegister=document.getElementById("GoToRegister")
btnGoToRegister.style.display='block'

function returnToMainPage(){
    window.location.assign("/")
}

function goToRegister(){
    window.location.assign("/Register")
}

btnReturnToMainPage.addEventListener("click", returnToMainPage)
btnGoToRegister.addEventListener("click", goToRegister)