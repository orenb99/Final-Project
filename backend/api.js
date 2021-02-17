const fs = require("fs");
let myTodo=[];
fs.readdir("./database/", (err, files) => {
  for(let file of files){
    myTodo.push(JSON.parse(fs.readFileSync("./database/"+file,"utf8")));
  }
});


function createItem(text,priority,date,checked){
   return {
        id:(myTodo.length),
        text: text,
        priority: priority,
        date: date,
        checked:checked
    };
}
function updateItem(item,text,priority,date,checked){
  item.text=text;
  item.priority=priority;
  item.date=date;
  item.checked=checked;
}

const express = require('express');
const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send(myTodo);
})

app.get("/myTodo/:id",(req,res)=>{
    const {id}= req.params;
    let intId=parseInt(id);
    try{
      res.send(myTodo[intId]);
    }
    catch(e){
      res.send("no item with that id");
    }
})

app.post("/", (request, response) => {
    const { body } = request;
    try {
      const item=createItem(body.text,body.priority,body.date,body.checked);
      myTodo.push(item);
      fs.writeFileSync(
        `./database/${item.id}.json`,
        JSON.stringify(item, null, 4)
      );
      response.status(201).send(`item ${item.id+1} added`);
    } catch (e) {
      response.status(500).json({ message: "Error!", error: e });
    }
  });

app.put("/", (request,response)=>{
  const { body } = request;
  try{
    for(let item of myTodo){
      if(body.id===item.id){
        updateItem(item,body.text,body.priority,body.date,body.checked);
        fs.writeFileSync(
          `./database/${item.id}.json`,
          JSON.stringify(item, null, 4)
        );
        response.send("item updated: \n"+item);
      }
    }
  }
  catch(e){
    response.send("no matching id");
  }
})


app.delete("/", (req,res)=>{
  const {body}= req;
  try{
  fs.unlinkSync(`./database/${body.id}.json`);
  res.send(`item ${body.id} deleted`);
  }
  catch{
    res.send("file doesn't exist");
  }
})
app.listen(3000);