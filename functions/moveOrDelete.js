module.exports = {

    moveOrDelete: function moveOrDelete(todoToUse, move, remove, finishOrUndo, currentStatus, archive) {
        const mysql = require('mysql');
        const con = mysql.createConnection({
            host: "mcldisu5ppkm29wf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            user: "qahzmtbcip5nby5j",
            password: "jovbqlrqqzwpp2o0",
            database: "e2bn6bjcv87iszow"
        });

        console.log(move);
        let query;
        //must the item be moved?
        if (move == true){
            query = "UPDATE todo SET done = " + finishOrUndo + " WHERE ID = '";
            console.log('moving.............');
        }
        //must item be removed?
        else if (remove == true){
            query = "DELETE FROM todo WHERE ID = '";
        }
        //Must item be archived?
        else if (archive == true){
            query = "UPDATE todo SET archived = 1 WHERE ID = '";
        }
        //check if data is an array
        if (todoToUse instanceof Array){
            console.log('Array ___________________________________________');

            //loop for array lenght to update the database
            for (var i = 0; i < todoToUse.length; i++){
                con.query("SELECT * FROM todo WHERE todo = '"+todoToUse[i]+"' AND done = " + currentStatus, function(err, rows){
                    if (err){
                        console.log(err);
                        return;
                    }
                    let toBeMoved;
                    rows.forEach(function(result) {
                        toBeMoved = result.ID;
                        console.log(toBeMoved);
                    })
                    con.query(query + toBeMoved +"'", function(err) {
                        if (err){
                            console.log(err);
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
                    }
                })
            })
        }

    }
};
