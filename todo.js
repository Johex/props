const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

//readline interface create
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



//promise to create tododatabase
var createDbPromise = new Promise(function (resolve, reject) {
    let TodoDb = new sqlite3.Database('todo.db', (err) => {
        if (err){
            reject('error on creating todo database: ' + err);
        }
        else {
            resolve('Todo DB created succesfully');
        }
    });
});

createDbPromise.then(function (fromResolve) {
    console.log(fromResolve);
}).catch(function (fromReject) {
    console.log(fromReject);
})