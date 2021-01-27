const textInput=document.getElementById("text-input");
const addButton=document.getElementById("add-button");
const selector=document.getElementById("priority-selector");
const viewSection=document.getElementById("view-section");

addButton.onclick=addToList;
function addToList(){
    if(textInput.value!==""){
        let container=document.createElement("div");
        container.innerText=textInput.value;
        viewSection.append(container);
        textInput.value="";
        textInput.focus();
    }
}