// team_seven Code Translator
//
// db.js - History database application
// This application will handle all of the SQL operations necessary for 
// the history page and queries.

var sqlite3 = require('sqlite3');
var mkdirp = require('mkdirp');
mkdirp.sync('./var/db');


// function runQueries(db) {
//     db.all(`
//     `, (err,rows) => {
//         rows.forEach(row => {
//             console.log(row.searchText + "\t" + row.result);
//         });
//     });
//     db.close();
// }

// function createTables(newdb) {
//     newdb.exec(`
//     create table history (
//         id INTEGER PRIMARY KEY NOT NULL,
//         searchText text not null,
//         result text not null,
//         date date not null
//     );
//     `, ()  => {
//         // runQueries(newdb);
//     });
// }
// function createDatabase() {
//     var newdb = new sqlite3.Database('app.db', (err) => {
//         if (err) {
//             console.log("Getting error " + err);
//             exit(1);
//         }
//         createTables(newdb);
//     });
// }

function insertDB(searchText, result, date) {
    var db = new sqlite3.Database('./var/db/app.db', (err) => {
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

function display(callback) {
    let res = [];
    var db = new sqlite3.Database('./var/db/app.db', (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        let sql = 'SELECT * FROM history';
            db.each(sql,(err, rows ) => {
                if (err) {
                    reject(err);
                }
                res.push(rows);
            },function(){
                db.close();
                callback(res);
            });
        });
}

// new sqlite3.Database('./app.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err && err.code == "SQLITE_CANTOPEN") {
//         createDatabase();
//         return;
//         } else if (err) {
//             console.log("Getting error " + err);
//             exit(1);
//     }
//     // runQueries(db);
// });

module.exports = { display, insertDB }