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
let descriptionListFinished = [];
let descriptionListToDO = [];
let descriptionListArchive = [];
let dateAddedDone = [];
let dateAddedFinished = [];
let dateFinished = [];
let dateFinishedArchive = [];
let dateAddedArchive = [];
let dateArchived = [];

let tableList = [];
let tableToUse = "todo";

router.get('/', function(req, res){
    res.render('index')
});

// to-do page
router.get('/todo', function(req, res){
    //get data from the database
    //get the not yet done to-do's
    todoList = [];

    con.query("select todo, description, DATE_FORMAT(`dateAdded`, '%Y-%m-%d %H:%i') AS `formatted_date` from "+ tableToUse +" WHERE done = 0 AND archived = 0 ORDER BY dateAdded ASC", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            todoList.push(result.todo);
            descriptionListToDO.push(result.description);
            dateAddedDone.push(result.formatted_date);

        });
        con.query("select todo, description, DATE_FORMAT(`dateAdded`, '%Y-%m-%d %H:%i') AS `formatted_dateAdded`, DATE_FORMAT(`dateFinished`, '%Y-%m-%d %H:%i') AS `formatted_dateFinished` from "+ tableToUse +" WHERE done = 1 AND archived = 0 ORDER BY dateFinished ASC", function(err, rows) {
            if (err){
                console.log(err);
                return;
            }
            rows.forEach(function(result) {
                finishedList.push(result.todo);
                descriptionListFinished.push(result.description);
                dateAddedFinished.push(result.formatted_dateAdded);
                dateFinished.push(result.formatted_dateFinished);
            });
            res.render('todo', {todoList: todoList, finishedList: finishedList, descriptionListToDo:descriptionListToDO, descriptionListFinished:descriptionListFinished, dateAddedDone:dateAddedDone, dateAddedFinished:dateAddedFinished, dateFinished:dateFinished});
            todoList = [];
            finishedList = [];
            descriptionListToDO = [];
            descriptionListFinished = [];
            dateAddedDone = [];
            dateFinished = [];
        })

    });

});

// submit route
router.post('/newtodo', function(req, res) {
    console.log("item submitted");
    var item = req.body.item;
    let description = req.body.description;
    console.log(description);
    todoList.push(item);
    //inserted the to-do in the database
    con.query("INSERT INTO "+ tableToUse + " (todo, done, description) VALUES ('"+item+"', 0, '"+description+"')", function(err) {
        if (err){
            console.log(err);
            return;
        }
        console.log("inserted: ", item);
        res.redirect("/todo");
    })

});



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


    //todo delete archive function
    // todo function call can be outsite if statement
    // check if user want to delete or mark done
    if (doneDeleteArchive == 'done'){
        move = true;
        remove = false;
        archive = false;
        finishOrUndo = 1;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, finishOrUndo, currentTodoStatus, archive, false, tableToUse);
    }
    else if (doneDeleteArchive == 'delete'){
        move = false;
        remove = true;
        archive = false;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, 0, currentTodoStatus, archive, false, tableToUse);
    }
    else if (doneDeleteArchive == 'archive'){
        move = false;
        remove = false;
        archive = true;
        currentTodoStatus = 0;
        moveOrDelete.moveOrDelete(finishedTodo, move, remove, 0, currentTodoStatus, archive, false, tableToUse);
    }

    //check for input in finished column
    if (undoDeleteArchive == 'undo'){
        move = true;
        remove = false;
        archive = false;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive, false, tableToUse);
    }
    else if (undoDeleteArchive == 'delete'){
        move = false;
        remove = true;
        archive = false;
        finishOrUndo = 0;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive, false, tableToUse);
    }
    else if (undoDeleteArchive == 'archive'){
        move = false;
        remove = false;
        archive = true;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoRight, move, remove, finishOrUndo, currentTodoStatus, archive, false, tableToUse);
    }

    //wait for mysql db then redirect back to to-do
    (async () => {
        await delay(600);
        res.redirect('/todo');
    })();

});

router.get ('/archive', function (req, res) {
    archivedList = [];
    con.query("SELECT todo, description, DATE_FORMAT(`dateAdded`, '%Y-%m-%d %H:%i') AS `formatted_dateAdded`, DATE_FORMAT(`dateFinished`, '%Y-%m-%d %H:%i') AS `formatted_dateFinished`, DATE_FORMAT(`dateArchived`, '%Y-%m-%d %H:%i') AS `formatted_dateArchived` from "+ tableToUse +" WHERE archived = 1 ORDER BY dateArchived ASC", function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function(result) {
            archivedList.push(result.todo);
            descriptionListArchive.push(result.description);
            dateAddedArchive.push(result.formatted_dateAdded);
            dateFinishedArchive.push(result.formatted_dateFinished);
            dateArchived.push(result.formatted_dateArchived);
        });

        res.render('archive', {archivedList: archivedList, descriptionListArchive:descriptionListArchive, dateAddedArchive:dateAddedArchive, dateFinishedArchive:dateFinishedArchive, dateArchived:dateArchived});
        //console.log(archivedList);
        archivedList = [];
        descriptionListArchive = [];
        dateAddedArchive = [];
        dateFinishedArchive = [];
        dateArchived = [];


    });
});

router.post('/archivepost', function (req,res) {
    let doneOrDelete = req.body.archiveButton;
    let todoToUse = req.body.archive;
    let move;
    let remove;
    let finishOrUndo;
    let archive;
    let currentTodoStatus;
    let unarchive;
    console.log(todoToUse);

    // delete if so desired
    if (doneOrDelete == 'delete'){
        move = false;
        remove = true;
        finishOrUndo = 0;
        archive = false;
        currentTodoStatus = 1;
        moveOrDelete.moveOrDelete(todoToUse, move, remove, finishOrUndo, currentTodoStatus, archive, false, tableToUse)
    }

    if (doneOrDelete == 'done'){
        move = false;
        remove = false;
        finishOrUndo = 1;
        archive = false;
        currentTodoStatus = 1;
        unarchive = true;
        moveOrDelete.moveOrDelete(todoToUse, move, remove, finishOrUndo, currentTodoStatus, archive, unarchive, tableToUse);
    }

    (async () => {
        await delay(600);
        res.redirect('/archive');
    })();
});

router.get('/add', function(req, res){

    let newTableName;
    const getTablesQuery = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='app' "

    con.query(getTablesQuery, function (err, rows) {
        if (err){
            console.log(err);
            return;
        }
        rows.forEach(function (result) {
            tableList.push(result.TABLE_NAME);
            // console.log(tableList[0]);
        })
    });
    (async () => {
        await delay(170);
        res.render('add', {tableList:tableList});
        tableList = [];
    })();

});

router.post('/newtotable', function(req, res) {
    //get table name from form
    let tableToAdd = req.body.addTable;

  //query to add new table
    let queryNewTable = "CREATE TABLE `"+ tableToAdd + "` (\n" +
      "\t`ID` INT(11) NOT NULL AUTO_INCREMENT,\n" +
      "\t`todo` TEXT NULL,\n" +
      "\t`done` BIT(1) NULL DEFAULT NULL,\n" +
      "\t`dateAdded` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,\n" +
      "\t`dateFinished` DATETIME NULL DEFAULT NULL,\n" +
      "\t`dateArchived` DATETIME NULL DEFAULT NULL,\n" +
      "\t`archived` BIT(1) NULL DEFAULT b'0',\n" +
      "\t`description` TEXT NULL,\n" +
      "\tPRIMARY KEY (`ID`)\n" +
      ")\n" +
      "COLLATE='latin1_swedish_ci'\n" +
      "ENGINE=InnoDB\n" +
      "AUTO_INCREMENT=0\n" +
      ";\n";
  // execute cet query
    con.query(queryNewTable);

    (async () => {
        await delay(500);
        res.redirect('/add');
    })();
});

router.post('/usetable', function (req, res) {
    //get the tabel name to delete/use
    let tableToUseOrDelete = req.body.radioTable;
    // query to drop the table
    const queryToDelete = "DROP TABLE `" + tableToUseOrDelete + "`";

    //get if need to delete or use
    let useOrDelete = req.body.useDeleteButton;

    if (useOrDelete === 'delete'){
        con.query(queryToDelete);
    }

    else if (useOrDelete === 'use'){
        tableToUse = tableToUseOrDelete;
    }


    (async () => {
        await delay(500);
        res.redirect('/add');
    })();
})

router.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
    console.log('nonopage');
});


module.exports = router;









