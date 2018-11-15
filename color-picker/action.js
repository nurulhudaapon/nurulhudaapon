let input1 = document.querySelector("#red");
let input2 = document.querySelector("#green");
let input3 = document.querySelector("#blue");
let input4 = document.querySelector("#alpha");
let output = document.querySelector(".color-container");



function d(){
output.style.background = 
"rgba("+input1.value+"," +input2.value+"," +input3.value+"," +input4.value+"%)"
}

input1.addEventListener("input", d)
input2.addEventListener("input", d)
input3.addEventListener("input", d)
input4.addEventListener("input", d)