module.exports = {

    moveOrDelete: function moveOrDelete(todoToUse, move, remove, finishOrUndo, currentStatus, archive, unarchive) {
        const mysql = require('mysql');
        const con = mysql.createConnection({
            host: "35.234.124.218",
            user: "root",
            password: "nyqegpueuxhrcjkkuehkvs%duumgkmwttymt6qfiuvcgqncku<ygPqtxLsuyeiazkqszk6",
            database: "app"
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

        //must item be unarchived?
        else if (unarchive = true){
            query = "UPDATE todo SET archived = 0 WHERE ID = '"
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
                    });
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
                let toBeMoved;
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
