const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
let db;
var answer;

var getToDoSql = 'SELECT * FROM listToDo';
//readline interface create
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



//promise to create tododatabase
var createDbPromise = new Promise(function (resolve, reject) {
    db = new sqlite3.Database('todo.db', (err) => {
        if (err){
            reject('error on creating todo database: ' + err);
        }
        else {
            resolve('Todo DB created successfully');

        }
    });
});

createDbPromise.then(function (fromResolve) {
    console.log(fromResolve);
    test();
}).catch(function (fromReject) {
    console.log(fromReject);
});

///promise to create table if not exist
function test() {

    var createTablePromise = new Promise(function (resolve, reject) {
        db.run("CREATE TABLE if not exists listToDo(done BIT, point TEXT, id INTEGER PRIMARY KEY AUTOINCREMENT)", [], (err) => {
            if (err){
                reject('Error on creating table' + err);
            }
            else {
                resolve('OK table')
            }
        });
    });

    createTablePromise.then(function (fromResolve) {
        console.log(fromResolve);
    }).catch(function (fromReject) {
        console.log(fromReject);
    });

}

function ToDo(){
    rl.question('Do you want to add to(1) or see (3) current todo list or mark point as done(4)? (2 to exit)', (answer) =>{
        console.log(answer);
        if (answer == 1){
            rl.question('What do you want to todo', (answer) =>{
                console.log(answer);

                //query to insert data
               let inQuery = 'INSERT INTO listToDo (done, point) VALUES (0,';
                //promise to add to do into db
                let insertTodo = new Promise(function (resolve, reject) {
                    inQuery = inQuery + "'" + answer + "')";
                    console.log(inQuery);
                    db.run(inQuery, [], (err) =>{
                        if (err){
                            reject('error on inserting data');
                            console.log(err);
                        }
                        else{
                            resolve('insert ok');
                        }
                    });
                });
                insertTodo.then(function (fromResolve) {
                    console.log(fromResolve);
                }).catch(function (fromReject) {
                    console.log(fromReject);
                })
            })
        }
        else if (answer == 2){
            console.log('Ok doei!');
        }
        else if (answer == 3){
            displayToDoList();
        }
        else if (answer == 4){
            markDone();
        }
        else {
            console.log('please enter either 1 or 2');
            ToDo();
        }
    });
}
ToDo();
//displayToDoList();

function displayToDoList(answer) {
    //promise to get data
    let listPromise = new Promise(function (resolve, reject) {
        db.all(getToDoSql, [], (err, rows)=>{
            if (err){
                reject('error on getting todo list');
                console.log(err);
            }
            else {
                resolve('got the todo list');
            }

            //print yes or no for done or not
            rows.forEach((row) =>{
                if (row.done == 0){
                    var finised = 'no'
                }
                console.log(row.point + '       ' + finised + '        ' + row.id);
            })
        });
    });
    listPromise.then(function (fromResolve) {
        console.log(fromResolve);
    }).catch(function (fromReject) {
        console.log(fromReject);
    });
}


//todo option to mark as done!
//function to mark option as done


