const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const mysql = require('mysql');
const moveOrDelete = require('C:\\Users\\MatisseColombonColtr\\Documents\\pws matisse\\props\\functions/moveOrDelete.js');
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
    todoList = [];
    con.query("select * from todo WHERE done = 0", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            //console.log(result.todo, result.done);
            todoList.push(result.todo);
        });
        con.query("select * from todo WHERE done = 1", function(err, rows) {
            if (err){
                console.log(err);
                return;
            }
            rows.forEach(function(result) {
                finishedList.push(result.todo);
                //console.log(result.todo, result.done);
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
    con.query("INSERT INTO todo (todo, done) VALUES ('"+item+"', 0)", function(err) {
        if (err){
            console.log(err);
            return;
        }
        console.log("inserted: ", item);
        res.redirect("/todo");
    })

})

//post route for moving to-dos to finshed
app.post('/finish', function(req, res) {
    var finishedTodo = req.body.todo;
    var todoRight = req.body.todoRight;
    var doneDelete = req.body.todoButton;
    var undoDelete = req.body.finishedButton;
    var move;
    var remove;
    //var for change finished in sql later setting it to one makes the item set to done and vice versa
    var finishOrUndo;
    //current status of the to-do 1 for done 0 for not done
    var currentTodoStatus;
    console.log(undoDelete);
    console.log(doneDelete);
    console.log(finishedTodo);
    console.log(todoRight);


    // check if user want to delete or mark done
    if (doneDelete == 'done'){
        move = true;
        remove = false;
        finishOrUndo = 1;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, finishOrUndo, currentTodoStatus);
    }
    else if (doneDelete == 'delete'){
        move = false;
        remove = true;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, 0, currentTodoStatus)
    }

    //check for input in finished column
    if (undoDelete == 'undo'){
        move = true;
        remove = false;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus);
    }
    else if (undoDelete == 'delete'){
        move = false;
        remove = true;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus);
    }

    res.redirect("/todo");




})


//catch non valid routes
app.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//___________________________________________________________________________________________________
//    function


// function moveOrDelete(todoToUse, move, remove, finishOrUndo, currentStatus) {
//     console.log(move);
//     var query;
//     if (move == true){
//         query = "UPDATE todo SET done = " + finishOrUndo + " WHERE ID = '";
//         console.log('moving.............');
//     }
//     else if (remove == true){
//         query = "DELETE FROM todo WHERE ID = '";
//     }
//
//     if (todoToUse instanceof Array){
//         console.log('Array ___________________________________________');
//
//         for (var i = 0; i < todoToUse.length; i++){
//             con.query("SELECT * FROM todo WHERE todo = '"+todoToUse[i]+"' AND done = " + currentStatus, function(err, rows){
//                 if (err){
//                     console.log(err);
//                     return;
//                 }
//                 var toBeMoved;
//                 rows.forEach(function(result) {
//                     toBeMoved = result.ID;
//                     console.log(toBeMoved);
//                 })
//                 con.query(query + toBeMoved +"'", function(err) {
//                     if (err){
//                         console.log(err);
//                         return;
//                     }
//                 })
//
//
//             });
//
//         }
//     }
//     else if (typeof todoToUse === 'string' || todoToUse instanceof String) {
//         con.query("SELECT * FROM todo WHERE todo = '"+todoToUse+"' AND done = " + currentStatus, function(err, rows){
//             if (err){
//                 console.log(err);
//                 return;
//             }
//             var toBeMoved;
//             rows.forEach(function(result) {
//                 toBeMoved = result.ID;
//                 console.log(toBeMoved + 'testtest');
//             })
//             con.query(query + toBeMoved + "'", function(err) {
//                 if (err){
//                     console.log(err);
//                     return;
//                 }
//             })
//
//         })
//     }

// }









