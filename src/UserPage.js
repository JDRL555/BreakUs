let btn1=document.getElementById("day1")
let btn2=document.getElementById("btn_ready")
let rutineBtn=document.getElementById("rutineBtn")
let planBtn=document.getElementById("planBtn")
let userBtn=document.getElementById("userBtn")
let content=document.getElementById("rutine1")

function Rutine(){
    document.getElementById("rutine").style.display='block';
    document.getElementById("user").style.display='none';
}

function User(){
    document.getElementById("rutine").style.display='none';
    document.getElementById("user").style.display='block';
}
rutineBtn.addEventListener('click', Rutine);
userBtn.addEventListener('click', User);



function Show(){
       if(content.style.display==='none'){
           content.style.display='block';
       }else{
           content.style.display='none';
       }
}
btn1.addEventListener("click", Show);

function No(){
    alert("Estimado usuario, para poder volver a seleccionar algun plan, debe poseer una cuenta como administrador.")
    alert("De no ser asi, usted no tiene acceso al cambio del plan")
}
planBtn.addEventListener('click', No)

var value_name=window.localStorage.getItem("Nombre")
var value_lastName=window.localStorage.getItem("Apellido")
var value_user=window.localStorage.getItem("Usuario")
var value_email=window.localStorage.getItem("Correo")
var value_date=window.localStorage.getItem("fechaDeInicio")

var td_name=document.getElementById("value_name")
var td_lastName=document.getElementById("value_lastName")
var td_user=document.getElementById("value_user")
var td_email=document.getElementById("value_email")
var td_date=document.getElementById("value_date")


td_name.innerHTML=value_name
td_lastName.innerHTML=value_lastName
td_user.innerHTML=value_user
td_email.innerHTML=value_email
td_date.innerHTML=value_date

