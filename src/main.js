const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const counter=document.getElementById("counter");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");
const sortButton=document.getElementById("sort-button");
const deleteButton=document.getElementById("delete-button");

//function calls and event listeners

addButton.onclick=addToList;
addButton.addEventListener("click",save);
sortButton.onclick=prioritize;
deleteButton.onclick=deleteChecked;

function addToList(){
    if(textInput.value!==""){
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
        
        itemPriority.innerText=selector.value;
        itemTime.innerText=convertTimeFormat(new Date());
        itemText.innerText=textInput.value;

        container.append(checkbox);
        container.append(itemPriority);
        container.append(itemTime);
        container.append(itemText);
        
        checkbox.onchange=checked;

        viewSection.append(container);
        textInput.value="";
        textInput.focus();

        counterChange(1);
    }
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

function save(){
    localStorage.clear();
    let itemArray=viewSection.getElementsByClassName("todo-container");
    let finalArray=[];
    for(let item of itemArray){
        finalArray.push({
            priority : item.querySelector(".todo-priority").innerText,
            time : item.querySelector(".todo-createdAt").innerText,
            text : item.querySelector(".todo-text").innerText,
            checkbox : item.querySelector(".checkbox").checked
        });
    }
    
    let myJSON=JSON.stringify(finalArray);
    localStorage.setItem("my-todo",myJSON);

    let text=localStorage.getItem("my-todo");
    let obj= JSON.parse(text);
    console.log(obj);
}