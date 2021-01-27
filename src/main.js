const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");

addButton.onclick=addToList;
function addToList(){
    if(textInput.value!==""){
        let container=document.createElement("div");
        let itemPriority=document.createElement("div");
        let itemTime=document.createElement("div");
        let itemText=document.createElement("div");
        let dateString=convertTimeFormat(new Date());
        container.classList.add("todo-container");
        itemPriority.classList.add("todo-priority");
        itemTime.classList.add("todo-createdAt");
        itemText.classList.add("todo-text");
        
        itemPriority.innerText=selector.value+".";
        itemTime.innerText=dateString;
        itemText.innerText=textInput.value;

        container.append(itemPriority);
        container.append(itemTime);
        container.append(itemText);
        viewSection.append(container);
        textInput.value="";
        textInput.focus();
    }
}
function convertTimeFormat(date){
let timeString=date.toTimeString();
let dateString=date.toDateString();
timeString=timeString.slice(0,timeString.indexOf("G")-1);
console.log(dateString);
}
function getMonthFromString(mon){

    var d = Date.parse(mon + "1, 2012");
    if(!isNaN(d)){
       return new Date(d).getMonth() + 1;
    }
    return -1;
  }