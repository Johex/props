module.exports = {
    finish: function finish() {
        const mysql = require('mysql');
        const moveOrDelete = require('Y:\\6\\Informatics\\pws\\props\\functions/moveOrDelete.js');
        const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "app"
        });

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
    }

}