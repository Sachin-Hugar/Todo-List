// import express from "express"
// import bodyParser from "body-parser";
// import mongoose from "mongoose";
// import cors from "cors"

// const app=express();  
// // mongoDb connection 
// mongoose.connect("mongodb://localhost:27017/todo-list")
// .then(()=>{
//     console.log("Connected to mongodb")
// })
// .catch((err)=>{
//     console.log("Could not connect to mongodb",err)
// })

// //Schema and model
// const todoSchema=new mongoose.Schema({
//     title:{type:string ,required:true},
//     completed:{type:Boolean,default:false}
// })


// app.listen('3000',()=>{
//     console.log("app is listening on port 3000");
// })
// app.get('/',(req,res)=>{
//     res.json({message :"hello"})
// })

// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todo-list')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());
app.use(cors());

// Define Schema and Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos', async  (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      completed: req.body.completed,
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
