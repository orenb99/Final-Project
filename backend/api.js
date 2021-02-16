let myTodo=[{
text:"yes",
priority:1,
date:new Date(),
checked:false
}];

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

const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());


app.get("/",(req,res)=>{
    res.send(todoItem);
})

app.put("/",(req,res)=>{
    res.send(req.body);
    //res.send(addItem("3",3,new Date(),false));
})



app.listen(3000);