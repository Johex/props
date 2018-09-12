const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
let db;
var todoAnswer;
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
        db.run("CREATE TABLE if not exists listToDo(done BIT, point TEXT)", [], (err) => {
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
    rl.question('Do you want to see current todo list? (1 for yes 2 for no)', (answer) =>{
        console.log(answer);
        if (answer == 1){
            rl.question('What do you want to todo', (answer) =>{
                console.log(answer);

                //query to insert data
               var inQuery = 'INSERT INTO listToDo (done, point) VALUES (0,';
                //promise to add to do into db
                var insertTodo = new Promise(function (resolve, reject) {
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
    });
}
ToDo();
