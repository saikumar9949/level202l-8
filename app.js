const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path=require("path");
app.use(bodyParser.json());

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.get("/", async (request, response) =>{
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")){
    response.render('index',{
      allTodos
    });
  }
  else{
    response.json({
      allTodos
    });
  }
  response.render('index');
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
 try{
  const todo =await Todo.findAll();
  response.send(todo);
 }
 catch (error){
  console.log(error);
  return response.status(422).json(error);
 }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try{
  const deletedTodo = await Todo.destroy({
    where:{
      id: request.params.id
    }
  });
  response.send(true);
}
catch (error){
  console.log(error);
  response.status(200).json(error);
}
});

module.exports = app;
