const express = require('express');
const port = 8080;
const bodyParser = require('body-parser');
const Todo = require('./models/todo');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app = express();



//to get the css file from public folder
app.use(express.static(__dirname + '/public'));



//set the view engine
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// It is used to configure the Express.js application to use the body-parser middleware for parsing
// URL-encoded data in the request body.


dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection Succesful"))
.catch((err)=>{
    console.log(err);
});


//get api
app.get('/', async function(req, res){
    try{
        let todoList = await Todo.find({});
        return res.render("index.ejs", {todoList: todoList});
    }catch(err){
        console.log('Error while fetching the todo list', err);
        return;
    }
})

//post api 
//route for adding new task
app.post("/newtodo", async function(req, res) {
    var newTask = new Todo({
      name: req.body.name
    });
  
    try {
      console.log(newTask);
      await Todo.create(newTask);
      console.log('Todo List created successfully');
      return res.status(200).json({ message: 'Todo List created successfully' });
    } catch (err) {
      console.log('Error while creating the todo List', err);
      return res.status(500).json({ message: 'Error while creating the todo List' });
    }
  });

 // route to update a task by id
 // PATCH API
  app.patch("/update/:id", async (req, res) => {
    let taskId = req.params.id; // Get the id from the API
    let updatedTask = req.body.name; // Get the updated task from the request body
 
    try {
      await mongoose.model("Todo").updateOne({ _id: taskId }, { name: updatedTask });
      console.log(`Task ${taskId} successfully updated in the database`);
      return res.redirect("/");
    } catch (err) {
      console.log(`Error updating the task ${taskId}`);
      return;
    }
  });
  
//route to delete a task by id
//DELETE API
app.delete("/delete/:id", async (req, res)=>{
    let taskId = req.params.id;//get the id from the api 
    console.log(req.params.id);
    try{
        await mongoose.model('Todo').deleteOne({_id: taskId});
        console.log("Task successfully deleted from database");
        return res.redirect("/");
    }catch(err){
        console.log(`Error is deleting the task ${taskId}`);
        return;
    }
});

//route for deleting all tasks
// DELETE ALL TASKS API
app.get("/delAlltodo", async (req, res)=>{
    try{
        await mongoose.model('Todo').deleteMany({});
        console.log(`Deleted all tasks`);
        return res.redirect("/");
    }catch(err){
        console.log('Error while deleting all the tasks from the Database', err);
        return;
    }
});

app.listen(port, function(err){
    if(err){
        console.log('Error while running the server', err);
        return;
    }
    console.log('Server is listening on port', port);
});