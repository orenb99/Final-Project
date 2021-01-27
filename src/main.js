const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const counter=document.getElementById("counter");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");
const sortButton=document.getElementById("sort-button");
addButton.onclick=addToList;
sortButton.onclick=prioritize;

function addToList(){
    if(textInput.value!==""){
        let container=document.createElement("div");
        let itemPriority=document.createElement("div");
        let itemTime=document.createElement("div");
        let itemText=document.createElement("div");
        
        container.classList.add("todo-container");
        itemPriority.classList.add("todo-priority");
        itemTime.classList.add("todo-createdAt");
        itemText.classList.add("todo-text");
        
        itemPriority.innerText=selector.value;
        itemTime.innerText=convertTimeFormat(new Date());
        itemText.innerText=textInput.value;

        container.append(itemPriority);
        container.append(itemTime);
        container.append(itemText);
        viewSection.append(container);
        textInput.value="";
        textInput.focus();

        counter.innerText=""+(parseInt(counter.innerText)+1);
        if(counter.innerText==="1")
            counter.nextSibling.nextSibling.innerText="Thing to do";
        else
            counter.nextSibling.nextSibling.innerText="Things to do";
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
