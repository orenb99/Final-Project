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

        container.classList.add("todo-container");
        itemPriority.classList.add("todo-priority");
        itemTime.classList.add("todo-createdAt");
        itemText.classList.add("todo-text");
        
        itemPriority=selector.value+" ";
        itemTime=new Date()+" ";
        itemText.innerText=textInput.value;
        
        container.append(itemPriority);
        container.append(itemTime);
        container.append(itemText);
        viewSection.append(container);
        textInput.value="";
        textInput.focus();
    }
}