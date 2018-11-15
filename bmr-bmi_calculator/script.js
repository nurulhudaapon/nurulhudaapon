let height = document.querySelector(".height");
let weight = document.querySelector(".weight");
let age = document.querySelector(".age");
let mgender = document.querySelector(".mgender");
let fgender = document.querySelector(".fgender");


let submitButton = document.querySelector(".submitButton");
let resetButton = document.querySelector(".resetButton")

let bmiDisplay = document.querySelector(".bmi");
let bmrDisplay = document.querySelector(".bmr");



const convert = () => {
let heightInMetre= (height.value/39.37);
let heightInCm= (heightInMetre*100);

console.log("female", fgender.checked)

console.log("male", mgender.checked)

let bmi = weight.value/(heightInMetre*heightInMetre);

let bmrm = (66+(13.7*weight.value)+(5*heightInCm)-(6.8*age.value));
let bmrf = (665+(9.6*weight.value)+(1.8*heightInCm)-(4.7*age.value));


bmiDisplay.innerHTML = bmi;

if (fgender.checked){
	bmrDisplay.innerHTML = bmrf;
} 
else if (mgender.checked) {bmrDisplay.innerHTML = bmrm;}
else {bmrDisplay.innerHTML = "Please choose your gender.";}

}


const reset = () => {
	height.value = "";
	weight.value = "";
	age.value = "";
	mgender.checked = false;
	fgender.checked = false;


}
resetButton.addEventListener("click", reset)
submitButton.addEventListener("click", convert)

