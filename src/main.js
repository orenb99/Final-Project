"use strict"
const body=document.getElementById("body");
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
const versionText=document.getElementById("version");
const undoText=document.getElementById("undoings");
const toolbar=document.getElementById("toolbar");
const checkAllButton=document.getElementById("check-all-button");
const spinner=document.getElementById("spinner");
const clearButton=document.getElementById("clear-cache");
//function calls and event listeners
body.onload=get;
addButton.addEventListener("click",addToList);
sortButton.addEventListener("click",prioritize);
deleteButton.addEventListener("click",deleteByClass);
editButton.addEventListener("click",edit);
undoButton.addEventListener("click",undoBin);
clearButton.addEventListener("click",deleteCache);
checkAllButton.onclick=checkAll;
//adding items
function addToList(){
    if(textInput.value!==""&&editButton.innerText==="edit mode"){
        let correctDate=convertTimeFormat(new Date());
        let container=addElements();
        assignValues(container,selector.value,correctDate,textInput.value);
        updateBin();
    }
    else if(editButton.innerText==="save"){
        alert("Finish editing your list before adding new tasks!");
    }
    else if(textInput.value===""){
        textInput.focus();
    }
}
//assigning values to the items
function assignValues(container,priority,date,text){
    container.querySelector(".todo-priority").innerText=priority;
    container.querySelector(".todo-text").innerText=text;
    container.querySelector(".todo-created-at").innerText=date;
    priorityClass();
    textInput.value="";
}
//creating the elements
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
            priorityClass()
            updateBin();
        }
    });
    decPriorityButton.addEventListener("click",function (){
        if(parseInt(itemPriority.innerText)>1){
            parseInt(itemPriority.innerText--);
            priorityClass()
            updateBin()
        }
    });
    

    viewSection.append(container);
    textInput.focus();
    counterChange();

    return container;

}
//changing the time format to SQL
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
//updating the counter
function counterChange(){
    counter.innerText=""+(viewSection.querySelectorAll(".todo-container").length);
    console.log(counter.innerText)
    if(counter.innerText==="1")
        counter.nextSibling.nextSibling.innerText="Thing to do";
    else if(counter.innerText==="Loading")
        counter.nextSibling.nextSibling.innerText=" Things to do";
    else
        counter.nextSibling.nextSibling.innerText="Things to do";
    if(counter.innerText==="0")
        counter.nextSibling.nextSibling.innerText="Things to do! You're free!";
}

//sorting the list
function prioritize(){
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
    updateBin();
}
//adding class to the container according to the priority
function priorityClass(){
    let itemsList=document.getElementsByClassName("todo-container");
    for(let item of itemsList){
        item.classList.remove("p1","p2","p3","p4","p5");
    }
    for(let item of itemsList){
        item.classList.add("p"+item.querySelector(".todo-priority").innerText)
    }

}
//adding a checked class to the checked containers
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
//delete  all items with a certain class
function deleteByClass(className){
    if(typeof className!=="string")
        className="checked";
    let checkedLines=viewSection.getElementsByClassName(className);
    while(checkedLines.length!==0){
        viewSection.removeChild(checkedLines[0]);
    }
    updateBin();
}
//checking all items
function checkAll(){
    let checkboxes=viewSection.querySelectorAll(".checkbox")
    if(checkAllButton.innerText==="Check all"){
        checkAllButton.innerText="Uncheck all";
        for(let box of checkboxes)
            box.checked=true;
        checked();
    }
    else{
        checkAllButton.innerText="Check all";
        for(let box of checkboxes)
            box.checked=false;
        checked();
}

}

//editing the list
let tempContainers=[];
function edit(){
    if(counter.innerText==="0"){
        textInput.focus();
        return;
    }
    let containers=viewSection.getElementsByClassName("todo-container");
    if(editButton.innerText==="edit mode"){
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
        deleteByClass("empty");
        updateBin();
    }
    
}
//toolbar
toolbar.addEventListener("mousedown",function(event){
    event.preventDefault();
    let target=event.target;
    if(target.id==="toolbar-title"||target.tagName==="H1"){
        toolbar.addEventListener("mousemove",dragging);
        toolbar.addEventListener("mouseup",stopped);
        body.addEventListener("mouseleave",stopped);
        function dragging(event){
            let x=event.clientX-toolbar.offsetWidth/2;
            let y=event.clientY-toolbar.querySelector("#toolbar-title").offsetHeight/2;
            if(x<0){
                x=0;
            }
            else if(x+toolbar.offsetWidth>window.innerWidth){
                x=window.innerWidth-toolbar.offsetWidth;
            }
            else{
            }
            if(y<0){
                y=0;
            }
            else if(y+toolbar.offsetHeight>window.innerHeight){
                y=window.innerHeight-toolbar.offsetHeight;
            }
            toolbar.style.left=x+"px";
            toolbar.style.top=y+"px";
        }
        function stopped(){
            toolbar.removeEventListener("mousemove",dragging);
            toolbar.removeEventListener("mouseup",stopped);
        }

    }
        
})
toolbar.addEventListener("click",function(event){
    let target=event.target;
    if(target.id==="colors-label"){
        hide(toolbar.querySelector("#tools"));
        show(toolbar.querySelector("#colors"));
        toolbar.querySelector("#colors").hidden=false;
    }
    else if(target.id==="tools-label"){
        hide(toolbar.querySelector("#colors"));
        show(toolbar.querySelector("#tools"))
    }

})
//getting the colors from the css
function getColors(){
let colorInputs=toolbar.querySelectorAll(`input[type="color"]`);
for(let input of colorInputs){
    input.value=getComputedStyle(document.documentElement).getPropertyValue("--"+input.id);
    input.onchange=function changeColor(){
        document.documentElement.style.setProperty("--"+input.id, input.value);
    };
}
}
//hide and show the toolbar sub menu
function hide(div){
    div.style.height="0";
    div.style.visibility="hidden";
    div.style.borderStyle= "hidden";
    if(div.id==="colors"){
        div.style.top="-20%";
    }
    let children=div.children;
    for(let child of children){
        child.style.visibility="hidden";
        child.style.opacity="0%";
        child.style.transition= "0.5s";
    }
}
function show(div){
    div.style.height="130px";
    div.style.visibility="visible";
    div.style.borderStyle= "solid";
    if(div.id==="colors"){
        div.style.top="0";
    }
    let children=div.children;
    for(let child of children){
        child.style.visibility="visible";
        child.style.opacity="100%";
        child.style.transitionProperty= "opacity";
        child.style.transition= "0.5s";
    }
}

// //JSON local storage (not used)
// function save(){
//     localStorage.removeItem("my-todo");
//     let initialArray=viewSection.getElementsByClassName("todo-container");
//     let finalArray=[];
//     for(let item of initialArray){
//         finalArray.push({
//             priority : item.querySelector(".todo-priority").innerText,
//             date : item.querySelector(".todo-created-at").innerText,
//             text : item.querySelector(".todo-text").innerText,
//             checkbox : item.querySelector(".checkbox").checked
//         });
//     }
    
//     let myJSON=JSON.stringify(finalArray);
//     localStorage.setItem("my-todo",myJSON);
// }

// function load(){
//     let JSONText=localStorage.getItem("my-todo");
//         let itemArray= JSON.parse(JSONText);
//         if(!itemArray)
//             return;
//         for(let item of itemArray){
//             let container=addElements();
//             assignValues(container,item.priority,item.date,item.text)
//         }
//     }


// function savePrevious(){
//     localStorage.removeItem("undo");
//     let initialArray=viewSection.getElementsByClassName("todo-container");
//     let finalArray=[];
//     for(let item of initialArray){
//         finalArray.push({
//             priority : item.querySelector(".todo-priority").innerText,
//             date : item.querySelector(".todo-created-at").innerText,
//             text : item.querySelector(".todo-text").innerText,
//             checkbox : item.querySelector(".checkbox").checked
//         });
//     }
//     let myJSON=JSON.stringify(finalArray);
//     localStorage.setItem("undo",myJSON);
// }
// function undo(){
//     let JSONText=localStorage.getItem("undo");
//     let itemArray= JSON.parse(JSONText);
//     if(!itemArray)
//         return;
//     let containers=viewSection.getElementsByClassName("todo-container");
    
//     while(containers.length!==0){
//         viewSection.removeChild(containers[0]);
//         counterChange();
//     }
//     for(let item of itemArray){
//         let container=addElements();
//         assignValues(container,item.priority,item.date,item.text);
//     }
//     localStorage.removeItem("undo");
//     editButton.innerText="edit mode";
//     save();
// }

//JSON.bin
const root = "http://localhost:3000/";
let currentVersion;
//adding items to the bin
async function post(containers) {
    let itemArray=[];
    for(let item of containers){
        itemArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            date : item.querySelector(".todo-created-at").innerText,
            text : item.querySelector(".todo-text").innerText,
            checkbox : item.querySelector(".checkbox").checked
        });
    }
    currentVersion++;
    const sendObject = {
        "myTodo":itemArray, "id":currentVersion
    };
    const jsonString = JSON.stringify(sendObject);
    const init = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonString,
    }
    const request = new Request(root, init);
    const response = await fetch(request);
}

//getting items from the bin
function get() {
    updateSpinner("show");
    const init = {
        method: "GET"
    }
    const request = new Request(root , init);
    const response = fetch(request).then(firstResponse=>{
        const body = firstResponse.json().then(secondResponse=>{
            let itemArray=secondResponse["myTodo"];
            currentVersion=secondResponse["id"];
            undoText.innerText=parseInt(currentVersion-undoCounter);
            versionText.innerText=currentVersion;
            if(itemArray===null||itemArray===undefined)
                return;
            for(let item of itemArray){
                let container=addElements();
                assignValues(container,item.priority,item.date,item.text);
        }
        undoCounter=0;
        updateSpinner("hide");
        })
    });
    getColors();
    }
//update the list according to the bin
async function updateBin(){
    updateSpinner("show");
    let containers=viewSection.querySelectorAll(".todo-container");
    await post(containers);
    undoCounter=0;
    undoText.innerText=parseInt(currentVersion-undoCounter);
    versionText.innerText=currentVersion;
    updateSpinner("hide");

}
//go one version backwards
let undoCounter=0;
function undoBin(){
    updateSpinner("show");
    if(editButton.innerText==="save"){
        alert("Stop Editing to undo");
        return;
    }
    let containers=viewSection.querySelectorAll(".todo-container");
    undoCounter++;
    for(let item of containers){
        item.remove();
    }
        
    const init = {
        method: "GET"
    }
    if(undoCounter>currentVersion){
        updateSpinner("hide");
        return;
    }
    const request = new Request(root +(currentVersion-undoCounter), init);
    const response = fetch(request).then(firstResponse=>{
        const body =firstResponse.json().then(secondResponse=>{
            let itemArray=secondResponse["myTodo"];
            for(let item of itemArray){
                let container=addElements();
                assignValues(container,item.priority,item.date,item.text);
            }
            undoText.innerText=parseInt(currentVersion-undoCounter);
            versionText.innerText=currentVersion;
            updateSpinner("hide");
        });
    });
}

function deleteCache(){
    if(!confirm("are u sure you want do reset your data?"))
        return;
    updateSpinner("show");
    editButton.text="edit";
    let containers=viewSection.querySelectorAll(".todo-container");
    for(let item of containers){
        item.remove();
    }
    const init = {
        method: "DELETE"
    }
    const request = new Request(root +("todo/all"), init);
    const response = fetch(request).then(firstResponse=>{
            updateSpinner("hide");
            undoCounter=0;
            currentVersion=0;
            undoText.innerText=0;
            versionText.innerText=0;
        });

}

function updateSpinner(stance){
    let otherItems = document.getElementsByClassName("not-spinner");
    switch (stance){
        case "show":
            spinner.hidden=false;
            for(let item of otherItems)
                item.hidden=true;
            counter.innerText="Loading";
            break;
        case "hide":
            spinner.hidden=true;
            for(let item of otherItems)
                item.hidden=false;
            counterChange();
            break;
    }
}