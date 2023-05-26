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
// It is used to configure the Express.js application to use the body-parser middleware for parsing
// URL-encoded data in the request body.
app.use(bodyParser.urlencoded({extended: true}));
// It middleware is responsible for parsing incoming requests with JSON payloads. 
//and is commonly used to handle HTTP POST requests where the data being sent to the server is in JSON format.
app.use(express.json());

// here, connect to the database 
dotenv.config();
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB connection Succesful"))
.catch((err)=>{
    console.log(err);
});


//get api, will fetch all the tasks
app.get('/', async function(req, res){
    try{
        let todoList = await Todo.find({});
        return res.render("index.ejs", {todoList: todoList});
    }catch(err){
        console.log('Error while fetching the todo list', err);
        return;
    }
})


//post api, route for adding new task 
app.post('/newtodo', async function(req, res) {
    var newTask = new Todo({
      name: req.body.name
    });
  
    try {
      await Todo.create(newTask);
      return res.status(200).json({ message: 'Todo List created successfully'});
    } catch (err) {
      console.log('Error while creating the todo List', err);
      return res.status(500).json({ message: 'Error while creating the todo List'});
    }
  });


 // PATCH API, route to update the particular task by id
  app.patch('/update/:id', async (req, res) => {
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
  

//DELETE API, route to delete the particular task by id
app.delete('/delete/:id', async (req, res)=>{
    let taskId = req.params.id;//get the id from the api 
    try{
        await mongoose.model('Todo').deleteOne({_id: taskId});
        console.log("Task successfully deleted from database");
        return res.redirect("/");
    }catch(err){
        console.log(`Error is deleting the task ${taskId}`);
        return;
    }
});


//DELETE ALL TASKS API, route for deleting all tasks
app.delete('/delAlltodo', async (req, res)=>{
    try{
        await mongoose.model('Todo').deleteMany({});
        console.log(`Deleted all tasks`);
        return res.redirect("/");
    }catch(err){
        console.log('Error while deleting all the tasks from the Database', err);
        return;
    }
});

// here, server is running on the specific port number
app.listen(port, function(err){
    if(err){
        console.log('Error while running the server', err);
        return;
    }
    console.log('Server is listening on port', port);
});