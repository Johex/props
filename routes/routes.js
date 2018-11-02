//todo connection pool
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');
const moveOrDelete = require('Y:\\6\\Informatics\\pws\\props\\functions\\moveOrDelete.js');
const delay = require('delay');
//const archive = require('Y:\\6\\Informatics\\pws\\props\\functions/archive.js');


const con = mysql.createConnection({
    host: "35.234.124.218",
    user: "root",
    password: "nyqegpueuxhrcjkkuehkvs%duumgkmwttymt6qfiuvcgqncku<ygPqtxLsuyeiazkqszk6",
    database: "app"
});
let todoList = [];
let finishedList =[];
let archivedList = [];

router.get('/', function(req, res){
    res.render('index')
});

// to-do page
router.get('/todo', function(req, res){
    //get data from the database
    //get the not yet done to-do's
    todoList = [];
    con.query("select * from todo WHERE done = 0 AND archived = 0", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            //console.log(result.todo, result.done);
            todoList.push(result.todo);
        });
        con.query("select * from todo WHERE done = 1 AND archived = 0", function(err, rows) {
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
    let doneDeleteArchive = req.body.todoButton;
    let undoDeleteArchive = req.body.finishedButton;
    let move;
    let remove;
    let archive;
    //var for change finished in sql later setting it to one makes the item set to done and vice versa
    let finishOrUndo;
    //current status of the to-do 1 for done 0 for not done
    let currentTodoStatus;
    console.log(undoDeleteArchive);



    // check if user want to delete or mark done
    if (doneDeleteArchive == 'done'){
        move = true;
        remove = false;
        archive = false;
        finishOrUndo = 1;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, finishOrUndo, currentTodoStatus, archive);
    }
    else if (doneDeleteArchive == 'delete'){
        move = false;
        remove = true;
        archive = false;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, 0, currentTodoStatus, archive)
    }
    else if (doneDeleteArchive == 'archive'){
        move = false;
        remove = false;
        archive = true;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, 0, currentTodoStatus, archive)
    }

    //check for input in finished column
    if (undoDeleteArchive == 'undo'){
        move = true;
        remove = false;
        archive = false;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive);
    }
    else if (undoDeleteArchive == 'delete'){
        move = false;
        remove = true;
        archive = false;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive);
    }
    else if (undoDeleteArchive == 'archive'){
        move = false;
        remove = false;
        archive = true;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive);
    }

    //wait for mysql db then redirect back to to-do
    (async () => {
        await delay(600);
        res.redirect('/todo');
    })();

});

router.get ('/archive', function (req, res) {
    archivedListList = [];
    con.query("select * from todo WHERE archived = 1", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            archivedList.push(result.todo);
        });

        res.render('archive', {archivedList: archivedList});
        //console.log(archivedList);
        archivedList = [];


    });
});

router.post('/archivepost', function (req,res) {
    let doneOrDelete = req.body.archiveButton;
    let todoToUse = req.body.archive;
    let move;
    let remove;
    let finishOrUndo;
    let a
    console.log(todoToUse);

    if (doneOrDelete == 'delete'){
        move = false;
        remove = true;
        finishOrUndo = 0;
        moveOrDelete.moveOrDelete(todoToUse, move, remove, finishOrUndo,)
    }
});



router.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
    console.log('nonopage');
});


module.exports = router;









