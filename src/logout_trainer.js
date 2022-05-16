var btnLogOut = document.getElementById("close_trainer")

function LogOut(){
    window.location.assign("/logout_trainer")
}
btnLogOut.addEventListener("click", LogOut)