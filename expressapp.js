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
    var doneDelete = req.body.todoButton;
    console.log(doneDelete);
    console.log(finishedTodo);


    // check if user want to delete or mark done
    if (doneDelete == 'done'){
        //move marked todos to finished aka set done to 1 in db
        var toBeDeleted;
        // todo: this must be more easily achievable please help Els
        //because if only one to-do-item is checked it doesnt run the for loop, so I first check if it is an array do you know a easier way to achieve this?
        if (finishedTodo instanceof Array){
            console.log('Array ___________________________________________');

            for (var i = 0; i < finishedTodo.length; i++){
                con.query("SELECT * FROM todo WHERE todo = '"+finishedTodo[i]+"'", function(err, rows){
                    if (err){
                        console.log(err);
                        return;
                    }
                    var toBeDeleted;
                    rows.forEach(function(result) {
                        toBeDeleted = result.ID;
                        console.log(toBeDeleted);
                    })
                    con.query("UPDATE todo SET done = 1 WHERE ID = '"+toBeDeleted+"'", function(err) {
                        if (err){
                            console.log(err);
                            return;
                        }
                    })


                });

            }
        }
        else if (typeof finishedTodo === 'string' || finishedTodo instanceof String) {
            con.query("SELECT * FROM todo WHERE todo = '"+finishedTodo+"' AND done != 1", function(err, rows){
                if (err){
                    console.log(err);
                    return;
                }
                var toBeDeleted;
                rows.forEach(function(result) {
                    toBeDeleted = result.ID;
                    console.log(toBeDeleted + 'testtest');
                })
                con.query("UPDATE todo SET done = 1 WHERE ID = '"+toBeDeleted+"'", function(err) {
                    if (err){
                        console.log(err);
                        return;
                    }
                })

            })
        }

        //move to done


    }
    else if (doneDelete = 'delete'){

    }

    res.redirect("/todo");




})


//catch non valid routes
app.get('*', function (req, res) {
    res.send("<h1>This page does not exist</h1>");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));









