let myTodo=[{
text:"yes",
priority:1,
date:new Date(),
checked:false
}];
let version=1;

let todoItem=[myTodo,version];
function addItem(text,priority,date,checked){
    myTodo.push({
        text: text,
        priority: priority,
        date: date,
        checked:checked
    });
}
addItem("yes",2,new Date(),false);
module.exports=todoItem;
const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("yo");
})



app.listen(3000);