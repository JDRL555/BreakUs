var btnRutines = document.getElementById("rutineBtn")
var btnProfile = document.getElementById("trainerBtn")
var rutines = document.getElementById("rutines").style.display='block'
var trainer = document.getElementById("trainer").style.display='none'

function Rutines(){
    document.getElementById("rutines").style.display='block'
    document.getElementById("trainer").style.display='none'
}

function Trainer(){
    document.getElementById("rutines").style.display='none'
    document.getElementById("trainer").style.display='block'
}

btnRutines.addEventListener("click", Rutines)
btnProfile.addEventListener("click", Trainer)