const sqlite3 = require('sqlite3');
const path = require('path')
const dbPath = path.resolve(__dirname, 'sharebite.db')

// Open database
let db = new sqlite3.Database('warmup2.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the warmup2 database.');
});

module.exports = {
    addUser: function (username, password, email, key, callback) {
        const addUserQuery = 'INSERT INTO User(username,password,email,key) VALUES(?,?,?,?)';
        db.run(addUserQuery, [username, password, email, key], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                callback(null, rows);
            }
        });
    },
    verify: function (email, key, callback) {
        console.log(email + key);
        const getKeyQuery = 'UPDATE User SET verified=1 WHERE email=? AND key=?';
        db.run(getKeyQuery, [email, key], (err, row) => {
            if (err) {
                callback(null, 0);
            }
            else {
                callback(null, 1);
            }
        });
    },
    login: function (username, password, callback) {
        const loginQuery = 'SELECT password, verified FROM User WHERE username = ?';
        db.get(loginQuery, [username], (err, row) => {
            if (err) {
                callback(null, 0);//username not found
            }
            else {
                console.log('0');
                if (password === row.password && row.verified === 1) {
                    console.log('1');
                    callback(null, 1);
                }
                else {
                    console.log('2');
                    callback(null, 0);
                }
            }
        });
    },
    getAllGames: function (callback) {
        const getGamesQuery = 'SELECT * FROM Games';
        db.all(getGamesQuery, [], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                console.log(rows);
                callback(null, rows);
            }
        });
    },
    getGamesById: function (id, callback) {
        const getGamesQuery = 'SELECT * FROM Games WHERE game_id = ?';
        db.all(getGamesQuery, [id], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                console.log(rows);
                callback(null, rows);
            }

        });
    },
    getUser: function (username, callback) {
        const getUserQuery = 'SELECT * FROM User WHERE username = ?';
        db.get(getUserQuery, [username], (err, row) => {
            if (err) {
                callback(err);
            } else {
                console.log(row);
                callback(null, row);
            }

        });
    },
    addGame: function (username, date, grid, winner, callback) {
        var grid_str = grid.join();
        const getUserQuery = 'INSERT INTO Games(username,start_date,grid,winner) VALUES(?,?,?,?)';
        db.run(getUserQuery, [username,date,grid_str,winner], (err, row) => {
            if (err) {
                callback(err);
            } else {
                console.log(row);
                callback(null, row);
            }
        });
    },
    getScore: function(callback) {
        const getScoreQuery = ''
    }
};