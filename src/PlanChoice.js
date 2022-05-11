let plan1 = document.getElementById("plan1")
let plan2 = document.getElementById("plan2")
let plan3 = document.getElementById("plan3")

function Plan1(){
    var option = confirm("Estas a punto de entrar al plan Novato, seguro que quieres continuar?") 
    if(option==true){
        window.location.assign("RutinePage.html");
    }else{
        return false
    }
}
function Plan2(){
    var option = confirm("Estas a punto de entrar al plan Intermedio, seguro que quieres continuar?") 
    if(option==true){
        window.location.assign("RutinePage.html");
    }else{
        return false
    }
}
function Plan3(){
    var option = confirm("Estas a punto de entrar al plan Avanzado, seguro que quieres continuar?") 
    if(option==true){
        window.location.assign("RutinePage.html");
    }else{
        return false
    }
}
plan1.addEventListener("click", Plan1);
plan2.addEventListener("click", Plan2);
plan3.addEventListener("click", Plan3);