let btn1=document.getElementById("day1")
let btn2=document.getElementById("btn_ready")
let rutineBtn=document.getElementById("rutineBtn")
let planBtn=document.getElementById("planBtn")
let userBtn=document.getElementById("userBtn")
let content=document.getElementById("rutine1")
let btnPlan1Edit = document.getElementById("plan1")
let btnPlan2Edit = document.getElementById("plan2")
let btnPlan3Edit = document.getElementById("plan3")

function Rutine(){
    document.getElementById("rutine").style.display='block';
    document.getElementById("user").style.display='none';
    document.getElementById("plans").style.display='none';
}

function User(){
    document.getElementById("rutine").style.display='none';
    document.getElementById("plans").style.display='none';
    document.getElementById("user").style.display='block';
}

function Show(){
       if(content.style.display==='none'){
           content.style.display='block';
       }else{
           content.style.display='none';
       }
}

function Ready(){
    window.location.assign("/complete_routine")
}


function Edit(){
    document.getElementById("rutine").style.display='none';
    document.getElementById("user").style.display='none';
    document.getElementById("plans").style.display='block';
}


function Plan1_edit(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_novato_edit")
    }
}

function Plan2_edit(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_intermedio_edit")
    }
}

function Plan3_edit(){
    var confirmar = confirm("¿Seguro que desea continuar?")
    if(confirmar){
        window.location.assign("/plan_avanzado_edit")
    }
}

rutineBtn.addEventListener('click', Rutine);
userBtn.addEventListener('click', User);
btn1.addEventListener("click", Show);
btn2.addEventListener("click", Ready);
planBtn.addEventListener('click', Edit);
btnPlan1Edit.addEventListener("click", Plan1_edit)
btnPlan2Edit.addEventListener("click", Plan2_edit)
btnPlan3Edit.addEventListener("click", Plan3_edit)
