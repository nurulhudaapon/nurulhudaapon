
var aln = "Welcome! You are a member of AAIA";
var alm = "You are not a member of AAIA";
var button = document.getElementById("button1")

function check(){
	var name = prompt ("What's your name?");
if (name==="akas"||name==="apon"||name==="imon"||name==="asik"||name==="Akas"||name==="Apon"||name==="Imon"||name==="Asik"){
alert(aln);
}
else{
alert(alm);
document.write("<h1 style='text-align:center'>Thanks for using our person validator</h1>")
}}
button.addEventListener("click", check)
