const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();
let db;

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
        db.run("CREATE TABLE if not exists test (vote TEXT)", [], (err) => {
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
