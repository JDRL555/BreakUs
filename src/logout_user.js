var btnLogOut = document.getElementById("close_user")

function LogOut(){
    window.location.assign("/logout_user")
}
btnLogOut.addEventListener("click", LogOut)