module.exports = {

    moveOrDelete: function moveOrDelete(todoToUse, move, remove, finishOrUndo, currentStatus) {
        const mysql = require('mysql');
        const con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root",
            database: "app"
        });

        console.log(move);
        var query;
        if (move == true){
            query = "UPDATE todo SET done = " + finishOrUndo + " WHERE ID = '";
            console.log('moving.............');
        }
        else if (remove == true){
            query = "DELETE FROM todo WHERE ID = '";
        }

        if (todoToUse instanceof Array){
            console.log('Array ___________________________________________');

            for (var i = 0; i < todoToUse.length; i++){
                con.query("SELECT * FROM todo WHERE todo = '"+todoToUse[i]+"' AND done = " + currentStatus, function(err, rows){
                    if (err){
                        console.log(err);
                        return;
                    }
                    var toBeMoved;
                    rows.forEach(function(result) {
                        toBeMoved = result.ID;
                        console.log(toBeMoved);
                    })
                    con.query(query + toBeMoved +"'", function(err) {
                        if (err){
                            console.log(err);
                            return;
                        }
                    })


                });

            }
        }
        else if (typeof todoToUse === 'string' || todoToUse instanceof String) {
            con.query("SELECT * FROM todo WHERE todo = '"+todoToUse+"' AND done = " + currentStatus, function(err, rows){
                if (err){
                    console.log(err);
                    return;
                }
                var toBeMoved;
                rows.forEach(function(result) {
                    toBeMoved = result.ID;
                    console.log(toBeMoved + 'testtest');
                })
                con.query(query + toBeMoved + "'", function(err) {
                    if (err){
                        console.log(err);
                        return;
                    }
                })

            })
        }

    }
};