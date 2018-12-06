
let result = document.querySelector(".resultContainer");


let submitButton = document.querySelector(".submitButton");
let resetButton = document.querySelector(".resetButton")

let bmiDisplay = document.querySelector(".bmi");
let bmrDisplay = document.querySelector(".bmr");
let statusDisplay = document.querySelector(".status");
let nweightDisplay = document.querySelector(".nweight");



// Calculating BMI & BMR
// Calculating BMI
const run = () => {


// Crating Variables
let heightInFeet = Number(document.querySelector(".heightInFeet").value);
let heightInInch = Number(document.querySelector(".heightInInch").value);
let weight = Number(document.querySelector(".weight").value);
let age = Number(document.querySelector(".age").value);
let mgender = document.querySelector(".mgender");
let fgender = document.querySelector(".fgender");









	
result.style.display = "block";
let height = ((heightInFeet * 12) + (heightInInch));
let heightInMetre= (height/39.37);
let heightInCm= (heightInMetre*100);
let bmi = weight/(heightInMetre*heightInMetre);
let hnweight = Number.parseFloat(24.9 * (heightInMetre*heightInMetre)).toFixed(2);
let lnweight = Number.parseFloat(18.5 * (heightInMetre*heightInMetre)).toFixed(2);


	 if (bmi < 18.5){statusDisplay.innerHTML = "Under Weight";}
else if (bmi <= 24.9){statusDisplay.innerHTML = "Normal Weight";}
else if (bmi <= 29.9){statusDisplay.innerHTML = "Over Weight";}
else if (bmi <= 34.9){statusDisplay.innerHTML = "Class I obesity";}
else if (bmi <= 39.9){statusDisplay.innerHTML = "Class II obesity";}
else if (bmi >= 40){statusDisplay.innerHTML = "Class III obesity";}

// Calculating BMR
let bmrm = (66+(13.7*weight)+(5*heightInCm)-(6.8*age));
let bmrf = (665+(9.6*weight)+(1.8*heightInCm)-(4.7*age));

bmiDisplay.innerHTML = bmi;
nweightDisplay.innerHTML = `${lnweight} KG to ${hnweight} KG`;

if (fgender.checked && age != ""){
	bmrDisplay.innerHTML = bmrf;
} 
else if (mgender.checked && age!= "") {bmrDisplay.innerHTML = bmrm;}
else {bmrDisplay.innerHTML = '<p class = "red">&nbsp;Choose gender first.</p>';}

}

// // Resting fields
// const reset = () => {
// 	height.value = "";
// 	weight.value = "";
// 	age.value = "";
// 	mgender.checked = false;
// 	fgender.checked = false;


// }
// resetButton.addEventListener("click", reset)
submitButton.addEventListener("click", run)

