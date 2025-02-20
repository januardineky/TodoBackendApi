const express = require('express');
const Todo = require('../models/todo');

const router = express.Router()

//Get All Todo Data
router.get("/todos", async (req, res) => {
    try{
        const todos = await Todo.find()
        res.status(200).json(todos)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Add Todo Data
router.post("/todos", async (req, res) => {
    try{
        const newTodo = new Todo(req.body);
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Get the Specified Todo Data by ID / Edit Todo
router.get("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) {
            return res.status(404).json({ message: "To-Do not Found" });
        }
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Update Todo
router.put("/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        res.status(200).json(todo)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//Delete Todo
router.delete("/todos/:id", async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "To-Do Deleted" })
    } catch (error) {
        res.status(500).json({ error:error.message })
    }
})

module.exports = router;