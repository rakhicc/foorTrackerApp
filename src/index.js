'use strict';
import snackbar from "snackbar"
import "snackbar/dist/snackbar.min.css"
/* const snackbar=require("snackbar");
require("snackbar/dist/snackbar.css"); */


import Chart from "chart.js/auto";

console.log("parcel test");
//let myChart;
let totalCalorieslogged=document.getElementById("totalCalories");
totalCalorieslogged.textContent='Total Calories logged: 0';
let chartStatus = Chart.getChart("myChart");
document.addEventListener('DOMContentLoaded',updatechart);
console.log("initialising chart");
const FetchWrapper=require("./FetchWrapper");
const button=document.getElementById("addButton");
const api= new FetchWrapper("https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/rakhiccabcdefghijkl");


const carbsMultiplier=4;
const proteinMultiplier=4;
const fatMultiplier=9;
let calories;

let totalCarbs=0;
   let totalProtein=0;
   let totalfat=0;
// function to display chart:
function updatechart(){
  console.log(totalCarbs);
    console.log(totalProtein);
    console.log(totalfat);
    let stars = [Number(totalCarbs), Number(totalProtein), Number(totalfat)];
let items = ['carbohydrate', 'protein', 'fat'];
console.log(stars);

let chartStatus = Chart.getChart("myChart"); // <canvas> id
if (chartStatus != undefined) {
  chartStatus.destroy();
}
let ctx = document.getElementById('myChart').getContext('2d');
 myChart = new Chart(ctx, {
  type: 'bar',
  data: {
     labels: items,
     datasets: [{
         label: 'Macronutrients',
         data: stars,
         backgroundColor: [
          "#e9724d",
          "#d6d727",
          "#92cad1",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)"
          ],

            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}
//function to calculate total calories
const calorieCalculator=(carbohydrate,prot,fats)=>{
calories=carbohydrate*carbsMultiplier+prot*proteinMultiplier+fats*fatMultiplier;
return calories;
}
//function to get data from firebase API
let foodItemsList=document.getElementById("foodItemsList");
foodItemsList.textContent='';
const getData=async()=>{
    const getUrl=api.get("");
 await getUrl.then(data=>{
    console.log(data);
     totalCarbs=0;
     totalProtein=0;
     totalfat=0;
   let carbsValue;
   let proteinValue;
   let fatValue;
   let itemValue;
   for(let item of data.documents){
carbsValue=Number(item.fields.carbs.integerValue);
proteinValue=Number(item.fields.protein.integerValue);
fatValue=Number(item.fields.fat.integerValue);
itemValue=item.fields.name.stringValue;
// part to display elements in list:

const div=document.createElement("div");
div.classList.add("foodItem");
const h3=document.createElement("h2");
const pitem=document.createElement("h3");
h3.textContent=itemValue;
pitem.textContent=`${calorieCalculator(carbsValue,proteinValue,fatValue)} calories`;
div.insertAdjacentElement('beforeend',h3);
div.insertAdjacentElement('beforeend',pitem);
const foodUl=document.createElement("ul");
foodUl.classList.add("foodItemUL");
const carbsLi=document.createElement("li");
carbsLi.textContent=`carbs: ${carbsValue}g`;
const proteinLi=document.createElement("li");
proteinLi.textContent=`protein: ${proteinValue}g`;
const fatLi=document.createElement("li");
fatLi.textContent=`fat: ${fatValue}g`;

foodUl.insertAdjacentElement('beforeend',carbsLi);
foodUl.insertAdjacentElement('beforeend',proteinLi);
foodUl.insertAdjacentElement('beforeend',fatLi);
console.log(div);
div.insertAdjacentElement('beforeend',foodUl);
foodItemsList.insertAdjacentElement('beforeend',div);
//
   
    totalCarbs=totalCarbs+carbsValue;
    totalProtein=totalProtein+proteinValue;
    totalfat=totalfat+fatValue;
    
   }
   
   totalCalorieslogged.textContent=`Total Calories logged: ${calorieCalculator(totalCarbs,totalProtein,totalfat)}`;
   console.log(totalCalorieslogged);

});
}

//function to post data to firebase API
const postData=async(carbohydrate,prot,fats,foodItem)=>{
    const body={fields: {
      carbs: {
          integerValue: carbohydrate
        },
        protein: {
          integerValue: prot
        },
        fat: {
          integerValue: fats
        },
        name: {
          stringValue: foodItem
        }
      }
    
    }
    const posturl= api.post("",body);
    console.log(body);
  await posturl.then(data=>{
    console.log(data);
})
}
// add button click action will call the update function
 button.addEventListener('click',update);
 async function update(){
    console.log("button");
    foodItemsList.textContent='';
    let menu=document.getElementById("menu").value;
    let carbs=document.getElementById("carbs").value;
    let protein=document.getElementById("protein").value;
    let fat=document.getElementById("fat").value;
    try {
    if((menu==="please select")){
      throw new Error("Please select food item");
    }
    if((carbs==="")|| (protein==="")|| (fat==="")){
      throw new Error("Please enter the values to proceed");
    }
    console.log(menu);
    console.log(carbs);
    console.log(protein);
    console.log(fat);
    
const totalcalories=calorieCalculator(carbs,protein,fat);
 await postData(Number(carbs),Number(protein),Number(fat),menu);

await getData();
updatechart();

snackbar.show('Food item added successfully!');
document.getElementById("menu").value="please select";
    document.getElementById("carbs").value="0g";
     document.getElementById("protein").value="0g";
   document.getElementById("fat").value="0g";
   
   console.log(menu);
    console.log(carbs);
    console.log(protein);
    console.log(fat);
}
catch(err) {
  //document.getElementById("demo").textContent = err.message;
  snackbar.show(err.message);
}

}

 
 