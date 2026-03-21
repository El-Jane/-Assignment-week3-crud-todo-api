require('dotenv').config();

const express = require ("express");
const cors = require('cors'); //cors
const logRequest = require('./middlewares/logger.js');
const validator = require('./middlewares/validator.js');
const errorhandler = require('./middlewares/errorHandler.js');
const app = express ();

//body parsing middleware
app.use(express.json());
app.use(cors('*'));
app.use(logRequest);

let todos = [
 {"id": 1, task: 'Learn Node.js', completed: false},
{ "id": 2, task: 'Build CRUD API', completed: false},
{ "id": 3, task: 'Build API', completed: true},
{ "id": 4, task: 'Learning new', completed: true},
];

app.get('/todos/completed', (req, res, next) => {
try {
    const completed = todos.filter((t) => t.completed);
res.json(completed); //Custom Read!
} catch (error) {
    next(error);
}
});

app.get ('/todos/:id', (req, res, next) => {
try {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        throw new Error("invalid ID")
}
const todo = todos.find((t) => t.id === id);

if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
}
        res.status(200).json(todo); // send array as JSON
} catch (error) {
    next(error);
}
});

app.post('/todos', validator.validatePostTodo, (req, res, next) => {
try {
    const newTodo = { id: todos.length + 1, ...req.body }; //Auto.ID
todos.push(newTodo);
res.status(201).json(newTodo); //Echo back
} catch (error) {
    next(error);
}
});

// PATCH Update ¬ Partial
app.patch('/todos/:id', validator.validatePatchTodo, (req, res, next) => {
    try {
        const todo =todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
    if (!todo) return res.status(404).json({ message: 'Todo not found'});
    Object.assign(todo, req.body); //Merge: e.g., {completed: true}
    res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
});

// DELETE Remove
app.delete('/todos/:id', (req, res, next) => {
try {
    const id = parseInt(req.params.id);
    const initialLenght = todos.length;
    todos = todos.filter((t) => t.id !== id); //Array.filter() - non-destructive
    if (todos.lenght === initialLenght) return res.status(404).json({ error: "Not found" });
    res.status(204).send (); //Silent success

} catch (error) {
next(error);    
}    
});


app.use(errorhandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`APP is listening on Port ${PORT}`);
});

