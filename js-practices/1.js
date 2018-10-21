var js1 = document.getElementById("js-1");
var js2 = document.getElementById("js-2");
var js3 = document.getElementById("js-3");
var js4 = document.getElementById("js-4");
var js5 = document.getElementById("js-5");
var js6 = document.getElementById("js-6");

function nAvailable(){
document.write(
"<h1 style='text-align:center'>This JS Program is still under development. <br>Thanks for trying my js</h1>")
}

// Action for JS Practice
function js1a(){
function greeting(){document.write("<h1 style='text-align:center'>Thanks for using our person validator</h1>")}
var name = prompt ("What's your name?");
if (name==="akas"||name==="apon"||name==="imon"||name==="asik"||name==="Akas"||name==="Apon"||name==="Imon"||name==="Asik"){
alert("Welcome! " +name+" You are a member of AAIA");
greeting()
}else{
alert("Sorry " +name+" You are not a member of AAIA");
greeting()}
}
function js2a(){
nAvailable()
}
function js3a(){
nAvailable()
}
function js4a(){
nAvailable()
}
function js5a(){
nAvailable()
}
function js6a(){
nAvailable()
}
// Event Listener
js1.addEventListener("click", js1a)
js2.addEventListener("click", js2a)
js3.addEventListener("click", js3a)
js4.addEventListener("click", js4a)
js5.addEventListener("click", js5a)
js6.addEventListener("click", js6a)
js7.addEventListener("click", js7a)

