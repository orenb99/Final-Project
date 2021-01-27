const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const selector=document.getElementById("priority-selector");
const list=document.getElementById("to-do-list");

addButton.onclick=addToList;
function addToList(){
    if(textInput.value!==""){
        let item=document.createElement("li");
        item.innerText=textInput.value;
        list.append(item);
        textInput.value="";
        textInput.focus();
    }
}