var sqlite3 = require('sqlite3');

function runQueries(db) {
    db.all(`
    `, (err,rows) => {
        rows.forEach(row => {
            console.log(row.searchText + "\t" + row.result);
        });
    });
    db.close();
}

function createTables(newdb) {
    newdb.exec(`
    create table history (
        id INTEGER PRIMARY KEY NOT NULL,
        searchText text not null,
        result text not null,
        date date not null
    );
    `, ()  => {
        // runQueries(newdb);
    });
}
function createDatabase() {
    var newdb = new sqlite3.Database('app.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function insertDB(searchText, result, date) {
    var db = new sqlite3.Database('app.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        db.run("insert into history(searchText,result,date) values (?,?,?)", [searchText, result, date], function (err) {
            if (err) {
                return console.log(err.message);
            }
              // get the last insert id
            console.log(`A row has been inserted with rowid ${this.id}`);
        });
        db.close();
    });
}


new sqlite3.Database('./app.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
        } else if (err) {
            console.log("Getting error " + err);
            exit(1);
    }
    // runQueries(db);
});

module.exports = { insertDB }