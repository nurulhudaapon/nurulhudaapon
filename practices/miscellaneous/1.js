var js1 = document.getElementById("js-1");
var js2 = document.getElementById("js-2");
var js3 = document.getElementById("js-3");
var js4 = document.getElementById("js-4");
var js5 = document.getElementById("js-5");

function nAvailable(){
document.write(
"<h1 style='text-align:center'>This JS Program is still under development. <br>Thanks for trying my js</h1>")
}

// Action for JS Practice
// AAIA Member validator
function js1a(){
function greeting(){document.write("<h1 style='text-align:center'>Thanks for using our person validator</h1>")}
var name = prompt ("What's your name?");
if (name ==="akas"||name==="apon"||name==="imon"||name==="asik"||name==="Akas"||name==="Apon"||name==="Imon"||name==="Asik"){
alert("Welcome! " +name+" You are a member of AAIA");
greeting()
}else{
alert("Sorry " +name+" You are not a member of AAIA");
greeting()}
}
// Browser Crasher
function js2a(){
for (var i=1; i>0; i++){
	console.log(i);
}
}
// Login Form
function js3a(){
var user = prompt("Username:");
var pass = prompt("Password:");
if (user==="apon" & pass === "123456"){
	alert("Thanks for Login");
}else{alert("Wrong Username and Password");}
}

// Facebook
function js4a(){

	let userlist = [
	{username: "apon", password: "123"}, 
	{username: "akas", password: "1234"}, 
	{username: "asik", password: "12345"}
	];

function ValidUser(username, password){
for (var i=0; i < userlist.length; i++){
if (username===userlist[i].username & password === userlist[i].password){
return true;}}
return false;}
function check(username, password){
if (ValidUser(username, password)){
alert("Thanks for Login");
} else {alert("Wrong Username and Password");}
}

var userp = prompt("Username:");
var passp = prompt("Password:");
check (userp, passp);
}

// Event Listener
js1.addEventListener("click", js1a)
js2.addEventListener("click", js2a)
js3.addEventListener("click", js3a)
js4.addEventListener("click", js4a)
