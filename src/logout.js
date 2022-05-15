var btnLogOut = document.getElementById("close")

function LogOut(){
    window.location.assign("/logout")
}
btnLogOut.addEventListener("click", LogOut)