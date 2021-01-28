
const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const counter=document.getElementById("counter");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");
const sortButton=document.getElementById("sort-button");
const deleteButton=document.getElementById("delete-button");
const editButton=document.getElementById("edit-button");

//function calls and event listeners
load();
addButton.addEventListener("click",addToList);
sortButton.addEventListener("click",prioritize);
sortButton.addEventListener("click",save);
deleteButton.addEventListener("click",deleteChecked);
deleteButton.addEventListener("click",save);
editButton.addEventListener("click",edit);


function addToList(){
    if(textInput.value!==""&&editButton.innerText==="edit mode"){
        let correctDate=convertTimeFormat(new Date());
        let container=addElements();
        assignValues(container,selector.value,correctDate,textInput.value);
        save();
    }
    else if(editButton.innerText==="save"){
        alert("Finish editing your list before adding new tasks!");
    }
    else if(textInput.value===""){
        alert("Write something to add!");
        textInput.focus();
    }
}

function assignValues(container,priority,date,text){
    container.querySelector(".todo-priority").innerText=priority;
    container.querySelector(".todo-text").innerText=text;
    container.querySelector(".todo-createdAt").innerText=date;
    textInput.value="";
}

function addElements(){
    let container=document.createElement("div");
    let itemPriority=document.createElement("div");
    let itemTime=document.createElement("div");
    let itemText=document.createElement("div");
    let checkbox=document.createElement("input");
    checkbox.type="checkbox";

    container.classList.add("todo-container");
    itemPriority.classList.add("todo-priority");
    itemTime.classList.add("todo-createdAt");
    itemText.classList.add("todo-text");
    checkbox.classList.add("checkbox");

    container.append(checkbox);
    container.append(itemPriority);
    container.append(itemTime);
    container.append(itemText);
    checkbox.onchange=checked;

    viewSection.append(container);
    textInput.focus();
    counterChange(1);

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

function counterChange(num){
    counter.innerText=""+(parseInt(counter.innerText)+num);
    if(counter.innerText==="1")
        counter.nextSibling.nextSibling.innerText="Thing to do";
    else
        counter.nextSibling.nextSibling.innerText="Things to do";
    if(counter.innerText==="0")
        counter.nextSibling.nextSibling.innerText+="! You're free!";
}


function prioritize(){
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
    let checkedLines=viewSection.getElementsByClassName("checked");
    counterChange(-checkedLines.length);
    while(checkedLines.length!==0){
        viewSection.removeChild(checkedLines[0]);
    }
    
}

function edit(){
    if(counter.innerText==="0"){
        alert("Nothing to edit!");
        textInput.focus();
        return;
    }
    let containers=viewSection.getElementsByClassName("todo-container");
    if(editButton.innerText==="edit mode"){
        editButton.innerText="save";
        for(let container of containers){
            let input=document.createElement("input");
            input.type="text";
            input.setAttribute("value",container.querySelector(".todo-text").innerText);
            input.classList.add("edit-input");
            container.querySelector(".todo-text").remove();
            container.append(input);
        }
    }
    else if(editButton.innerText==="save"){
        editButton.innerText="edit mode";
        for(let container of containers){
            let itemText=document.createElement("div");
            itemText.innerText=container.querySelector(".edit-input").value;
            itemText.classList.add("todo-text");
            container.querySelector(".edit-input").remove();
            container.append(itemText);
        }
    }
    
}



function save(){
    localStorage.clear();
    let initialArray=viewSection.getElementsByClassName("todo-container");
    let finalArray=[];
    for(let item of initialArray){
        finalArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            date : item.querySelector(".todo-createdAt").innerText,
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
    
        for(let item of itemArray){
            let container=addElements();
            assignValues(container,item.priority,item.date,item.text)
        }
    }