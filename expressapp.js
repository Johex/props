const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

var todoList = [
    "todo 1",
    "todo 2",
    "Homework",
    "test123"
]

//view engine:
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//set static path
app.use(express.static(path.join(__dirname, 'public')));

// index
app.get('/', function(req, res){
    res.render('index');
});

// to-do page
app.get('/todo', function(req, res){
    res.render('todo', {todoList: todoList});
});

// submit route
app.post("/newtodo", function(req, res) {
    console.log("item submitted");
    var item = req.body.item;
    todoList.push(item);
    res.redirect("/todo");
})

//catch non valid routes
app.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));









