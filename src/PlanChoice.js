const plan1 = document.getElementById("plan1")
const plan2 = document.getElementById("plan2")
const plan3 = document.getElementById("plan3")


function Plan1(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_novato")
    }
}

function Plan2(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_intermedio")
    }
}

function Plan3(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_avanzado")
    }
}


plan1.addEventListener("click", Plan1);
plan2.addEventListener("click", Plan2);
plan3.addEventListener("click", Plan3);