module.exports = {

    moveOrDelete: function moveOrDelete(todoToUse, move, remove, finishOrUndo, currentStatus, archive, unarchive, tableToUse) {
        const mysql = require('mysql');
        const con = mysql.createConnection({
            host: "35.234.124.218",
            user: "root",
            password: "nyqegpueuxhrcjkkuehkvs%duumgkmwttymt6qfiuvcgqncku<ygPqtxLsuyeiazkqszk6",
            database: "app"
        });

        console.log(move);
        let query;
        //must the item be moved to finished?
        if (move == true && finishOrUndo == 1){
            query = "UPDATE "+ tableToUse +" SET done = " + finishOrUndo + ", dateFinished = CURRENT_TIMESTAMP()  WHERE ID = '";
            console.log('moving...TOFINISHED..........');
        }

        //must item be moved back to to-do
        else if (move == true && finishOrUndo == 0){
            query = "UPDATE "+ tableToUse +" SET done = " + finishOrUndo + ", dateFinished = NULL  WHERE ID = '";
            console.log('moving......TOTODO.......');
        }

        //must item be removed?
        else if (remove == true){
            query = "DELETE FROM todo WHERE ID = '";
        }
        //Must item be archived?
        else if (archive == true){
            query = "UPDATE "+ tableToUse +" SET archived = 1, dateArchived = CURRENT_TIMESTAMP()  WHERE ID = '";
        }

        //must item be unarchived?
        else if (unarchive = true){
            query = "UPDATE "+ tableToUse +" SET archived = 0, dateArchived = NULL WHERE ID = '"
        }
        //check if data is an array
        if (todoToUse instanceof Array){
            console.log('Array ___________________________________________');

            //loop for array lenght to update the database
            for (var i = 0; i < todoToUse.length; i++){
                con.query("SELECT * FROM "+ tableToUse +" WHERE todo = '"+todoToUse[i]+"' AND done = " + currentStatus, function(err, rows){
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
            con.query("SELECT * FROM "+ tableToUse +" WHERE todo = '"+todoToUse+"' AND done = " + currentStatus, function(err, rows){
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
