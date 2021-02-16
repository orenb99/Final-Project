let myTodo=[{
    id: 1,
    text:"1",
    priority:1,
    date:new Date(),
    checked:false
}];

function addItem(text,priority,date,checked){
    myTodo.push({
        id:(myTodo.length+1),
        text: text,
        priority: priority,
        date: date,
        checked:checked
    });
}

const { response } = require('express');
const express = require('express');
const app = express();
app.use(express.json());


app.get("/",(req,res)=>{
    res.send(myTodo);
})

app.get("/myTodo/:id",(req,res)=>{
    const id=req.params.id;
    if(id>myTodo.length||id<=0)
        res.send("no such id");
})

app.put("/",(req,res)=>{
    res.send(addItem("2",2,new Date(),false));
})



app.listen(3000);