//todo connection pool
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const moveOrDelete = require('Y:\\6\\Informatics\\pws\\props\\functions\\moveOrDelete.js');
const finish = require('Y:\\6\\Informatics\\pws\\props\\functions\\finish.js');

const con = mysql.createConnection({
    host: "mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "qahzmtbcip5nby5j",
    password: "jovbqlrqqzwpp2o0",
    database: "e2bn6bjcv87iszow"
})
let todoList = [];
let finishedList =[];

router.get('/', function(req, res){
    res.render('index')
});

// to-do page
router.get('/todo', function(req, res){
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
router.post('/newtodo', function(req, res) {
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

router.post('/finish', function(req, res) {
    //finish.finish();
    let finishedTodo = req.body.todo;
    let todoRight = req.body.todoRight;
    let doneDelete = req.body.todoButton;
    let undoDelete = req.body.finishedButton;
    let move;
    let remove;
    //var for change finished in sql later setting it to one makes the item set to done and vice versa
    let finishOrUndo;
    //current status of the to-do 1 for done 0 for not done
    let currentTodoStatus;
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

    // res.redirect("/todo");




});

router.get ('/archive', function (req, res) {
    res.render('archive');
})
router.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
    console.log('nonopage');
});


module.exports = router;