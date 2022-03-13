const { request } = require('express');
const express = require('express');
const req = require('express/lib/request');
const  { v4 } = require("uuid")
 
const app = express();
app.use(express.json());
const users = [];

function verifyExistsUserAccount(req, res, next) {
    const {username} = req.headers;
    const user = users.find((user) => user.username === username);
    if (!user) {
       return res.status(404).json({error: "User not found!"});     
    }
 
    req.user = user;
    return next();
  
 }

app.post('/users' , (req , res)=>{

    const { username, name } = req.body;
 
    const userAlreadyExists = users.some(
       (user)=>user.username === username
    );
 
    if (userAlreadyExists) {
       return res.status(400).json({error: "User already Exists!"});     
    }
 
    const user = {
       username,
       name,
       id: v4(),
       todos: []
    }

    users.push(user)
 
    return res.status(201).json({ user });
 
 });

 app.get('/todos', verifyExistsUserAccount, (req, res) => {
    const {user} = req;

    return res.status(201).json(user.todos)
 });

 app.post('/todos', verifyExistsUserAccount, (req,res) => {
    const {user} = req;
    const {title, deadline} = req.body;
    
    
    const todo = {
        id: v4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    user.todos.push(todo);
    return res.status(201).json(todo)
 });

 app.put('/todos', verifyExistsUserAccount, (req,res) => {
    const {user} = req;
    const {id} = req.query;

    const todo = user.todos.find(
        (todo) => id === todo.id 
    )

    if(todo) {

    if (req.body.title){
        const {title } = req.body;
        todo.title = title}
    
    if (req.body.deadline){
        const  { deadline } = req.body;
        todo.deadline =  new Date(deadline)
    }

    if (req.body.title || req.body.deadline) {
        return res.status(201).json(todo)
    } else {
        return res.status(400).json({"error": "title or deadline parameter not found in the body" })
    }
    } else {
        return res.status(400).json({"error": "id not found for user" })

    }
    

 });

 app.patch('/todos/:id/done', verifyExistsUserAccount, (req,res) => {
    const {user} = req;
    const {id} = req.query;

    const todo = user.todos.find(
        (todo) => id === todo.id 
    ) 
    if (title){
        todo.title = title
    };
    if (deadline) {
        todo.deadline =  new Date(deadline)
    };
    if (title || deadline) {
        return res.status(201).json(todo)
    } else {
        return res.status(400).json({"error": "title or deadline parameter not found in the body" })
    }
    

 });

 app.delete('/todos',verifyExistsUserAccount, (req,res) => {
    const { id } = req.query;
    const { user } = req


    const todo = user.todos.find(
        (todo) => id === todo.id 
    ) 

    if (todo){        
        const indexTodo = user.todos.findIndex(
            todoIndex => todoIndex.id === todo.id);
        user.todos.splice(indexTodo,1);
        
        return res.status(200).json({ message: "Todo deleted successfully" })
        
    }else{
        
        return res.status(400).json({ message: "Todo id not found" })
    }
    
 })

app.listen(3335);