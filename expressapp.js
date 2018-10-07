const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const mysql = require('mysql');
var test;

var todoList = [];
var finishedList =[];

// connect to the database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "app"
})

//check database connection
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database!");
})



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
    //get data from the database
    //get the not yet done to-do's
    con.query("select * from todo WHERE done = 0", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            console.log(result.todo, result.done);
            todoList.push(result.todo);
        });
        con.query("select * from todo WHERE done = 1", function(err, rows) {
            if (err){
                console.log(err);
                return;
            }
            rows.forEach(function(result) {
                finishedList.push(result.todo);
                console.log(result.todo, result.done);
            })
            res.render('todo', {todoList: todoList, finishedList: finishedList});
            todoList = [];
            finishedList = [];
        })

    });

});

// submit route
app.post("/newtodo", function(req, res) {
    console.log("item submitted");
    var item = req.body.item;
    todoList.push(item);
    //inserted the to-do in the database
    con.query("INSERT INTO todo (todo, done) VALUES ('"+item+"', 0)", function(err, result) {
        if (err){
            console.log(err);
            return;
        }
        console.log("inserted: ", item);
        res.redirect("/todo");
    })

})

//catch non valid routes
app.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));









