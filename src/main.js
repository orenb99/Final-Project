"use strict"
const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const counter=document.getElementById("counter");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");
const doneSection=document.getElementById("done-section");
const sortButton=document.getElementById("sort-button");
const deleteButton=document.getElementById("delete-button");
const editButton=document.getElementById("edit-button");
const undoButton=document.getElementById("undo-button");

//function calls and event listeners
addButton.addEventListener("click",addToList);
sortButton.addEventListener("click",prioritize);
deleteButton.addEventListener("click",deleteChecked);
editButton.addEventListener("click",edit);
undoButton.addEventListener("click",undo);
function addToList(){
    if(textInput.value!==""&&editButton.innerText==="edit mode"){
        savePrevious();
        let correctDate=convertTimeFormat(new Date());
        let container=addElements();
        assignValues(container,selector.value,correctDate,textInput.value);
        save();
    }
    else if(editButton.innerText==="save"){
        alert("Finish editing your list before adding new tasks!");
    }
    else if(textInput.value===""){
        textInput.focus();
    }
}

function assignValues(container,priority,date,text){
    container.querySelector(".todo-priority").innerText=priority;
    container.querySelector(".todo-text").innerText=text;
    container.querySelector(".todo-created-at").innerText=date;
    textInput.value="";
}

function addElements(){
    let container=document.createElement("div");
    let itemPriority=document.createElement("div");
    let itemTime=document.createElement("div");
    let itemText=document.createElement("div");
    let checkbox=document.createElement("input");
    let incPriorityButton=document.createElement("button");
    let decPriorityButton=document.createElement("button");

    checkbox.type="checkbox";
    checkbox.onchange=checked;

    container.classList.add("todo-container");
    itemPriority.classList.add("todo-priority");
    itemTime.classList.add("todo-created-at");
    itemText.classList.add("todo-text");
    checkbox.classList.add("checkbox");
    incPriorityButton.classList.add("priority-change-button");
    decPriorityButton.classList.add("priority-change-button");

    container.append(checkbox);
    container.append(incPriorityButton);
    container.append(decPriorityButton);
    container.append(itemPriority);
    container.append(itemTime);
    container.append(itemText);
    incPriorityButton.innerText="+";
    decPriorityButton.innerText="-";

    incPriorityButton.addEventListener("click",function (){
        if(parseInt(itemPriority.innerText)<5){
            parseInt(itemPriority.innerText++);
            save();
        }
    });
    decPriorityButton.addEventListener("click",function (){
        if(parseInt(itemPriority.innerText)>1){
            parseInt(itemPriority.innerText--);
            save();
        }
    });
    

    viewSection.append(container);
    textInput.focus();
    counterChange();

    return container;

}

function convertTimeFormat(date){
    let timeString=date.toTimeString();
    timeString=timeString.slice(0,timeString.indexOf("G")-1);
    let dateString=date.getFullYear()+"-";
    let dayString=date.getDate();
    let monthString=(date.getMonth()+1)+"-";
    if(date.getDate()<10)
        dayString="0"+dayString;
    if(date.getMonth()<10)
        monthString="0"+monthString;
    dateString+=monthString+dayString+" "+timeString;
    return dateString;
}

function counterChange(){
    counter.innerText=""+(viewSection.querySelectorAll(".todo-container").length);
    if(counter.innerText==="1")
        counter.nextSibling.nextSibling.innerText="Thing to do";
    else
        counter.nextSibling.nextSibling.innerText="Things to do";
    if(counter.innerText==="0")
        counter.nextSibling.nextSibling.innerText+="! You're free!";
}


function prioritize(){
    savePrevious();
    if(editButton.innerText==="save"){
        alert("Stop editing to sort");
        return;
    }
    let itemsList=document.getElementsByClassName("todo-container");
    if(itemsList.length===0)
        return;
    let sortedArr=[];
    for(let i=5;i>0;i--){
        for(let item of itemsList){
            if(item.querySelector(".todo-priority").innerText===String(i))
                sortedArr.push(item);
        }
    }
    for(let item of sortedArr){
            viewSection.append(item);
    }
    save();
}

function checked(){
    let checkboxes=viewSection.querySelectorAll(".checkbox");
    for(let box of checkboxes){
        if(box.checked){
            box.parentElement.classList.add("checked");
            box.classList.remove("checked");
        }
        else
            box.parentElement.classList.remove("checked");
    }

}

function deleteChecked(){
    savePrevious();
    let checkedLines=viewSection.getElementsByClassName("checked");
    counterChange();
    while(checkedLines.length!==0){
        viewSection.removeChild(checkedLines[0]);
    }
    save();
}
function deleteEmpty(){
    let checkedLines=viewSection.getElementsByClassName("empty");
    counterChange();
    while(checkedLines.length!==0){
        viewSection.removeChild(checkedLines[0]);
    }
    save();
}

let tempContainers=[];
function edit(){
    if(counter.innerText==="0"){
        textInput.focus();
        return;
    }
    let containers=viewSection.getElementsByClassName("todo-container");
    if(editButton.innerText==="edit mode"){
        savePrevious();
        tempContainers=[];
        editButton.innerText="save";
        for(let i=0;i<containers.length;i++){
            tempContainers.push(containers[i].querySelector(".todo-text").innerText)
            let input=document.createElement("input");
            input.type="text";
            input.setAttribute("value",containers[i].querySelector(".todo-text").innerText);
            input.classList.add("edit-input");
            containers[i].querySelector(".todo-text").remove();
            containers[i].append(input);   
        }
    }
    else if(editButton.innerText==="save"){
        editButton.innerText="edit mode";
        for(let i=0;i<containers.length;i++){
            let itemText=document.createElement("div");
            itemText.innerText=containers[i].querySelector(".edit-input").value;
            itemText.classList.add("todo-text");
            containers[i].querySelector(".edit-input").remove();
            containers[i].append(itemText);
            if(itemText.innerText!==tempContainers[i])
                containers[i].querySelector(".todo-created-at").innerText=convertTimeFormat(new Date());

        }
        for(let i=0;i<containers.length;i++){
            if(containers[i].querySelector(".todo-text").innerText===""){
                containers[i].classList.add("empty");
            }
        }
        deleteEmpty();
        save();
    }
    
}

//JSON local storage
function save(){
    localStorage.removeItem("my-todo");
    let initialArray=viewSection.getElementsByClassName("todo-container");
    let finalArray=[];
    for(let item of initialArray){
        finalArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            date : item.querySelector(".todo-created-at").innerText,
            text : item.querySelector(".todo-text").innerText,
            checkbox : item.querySelector(".checkbox").checked
        });
    }
    
    let myJSON=JSON.stringify(finalArray);
    localStorage.setItem("my-todo",myJSON);
}

function load(){
    let JSONText=localStorage.getItem("my-todo");
        let itemArray= JSON.parse(JSONText);
        if(!itemArray)
            return;
        for(let item of itemArray){
            let container=addElements();
            assignValues(container,item.priority,item.date,item.text)
        }
    }


function savePrevious(){
    localStorage.removeItem("undo");
    let initialArray=viewSection.getElementsByClassName("todo-container");
    let finalArray=[];
    for(let item of initialArray){
        finalArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            date : item.querySelector(".todo-created-at").innerText,
            text : item.querySelector(".todo-text").innerText,
            checkbox : item.querySelector(".checkbox").checked
        });
    }
    let myJSON=JSON.stringify(finalArray);
    localStorage.setItem("undo",myJSON);
}
function undo(){
    let JSONText=localStorage.getItem("undo");
    let itemArray= JSON.parse(JSONText);
    if(!itemArray)
        return;
    let containers=viewSection.getElementsByClassName("todo-container");
    
    while(containers.length!==0){
        viewSection.removeChild(containers[0]);
        counterChange();
    }
    for(let item of itemArray){
        let container=addElements();
        assignValues(container,item.priority,item.date,item.text);
    }
    localStorage.removeItem("undo");
    editButton.innerText="edit mode";
    save();
}

//JSON.bin
const ROOT = "https://api.jsonbin.io/v3/b/";
const BIN_ID = "6015dc936426b448ee0ed2bb";

async function put(containers) {
    let itemArray=[];
    for(let item of containers){
        itemArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            date : item.querySelector(".todo-created-at").innerText,
            text : item.querySelector(".todo-text").innerText,
            checkbox : item.querySelector(".checkbox").checked
        });
        item.remove();
    }

    const sendObject = {
        "my-todo":itemArray
    };
    const jsonString = JSON.stringify(sendObject);
    console.log(sendObject);
    const init = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonString,
    }
    const request = new Request(ROOT + BIN_ID, init);
    const response = await fetch(request);
}


async function get() {
    
    const init = {
        method: "GET"
    }
    const request = new Request(ROOT + BIN_ID + "/latest", init);
    const response = await fetch(request);
    const body = await response.json();
    let itemArray=body.record["my-todo"];
    for(let item of itemArray){
        let container=addElements();
        assignValues(container,item.priority,item.date,item.text);
    }
    counterChange();
}

async function load2(){
    await get();
}
async function update(){
    let containers=viewSection.querySelectorAll(".todo-container");
    await put(containers);
    await get();
}
//update();