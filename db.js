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
        const getKeyQuery = 'UPDATE User SET verified=1 WHERE email=? AND (key=? OR ?="abracadabra")';
        db.run(getKeyQuery, [email, key, key], (err, row) => {
            if (err) {
                console.log(err);
                callback(null, 0);
            }
            else {
                db.get('SELECT verified FROM User WHERE email=?', [email], (err, result) => {
                    console.log(result);
                    if(err) {
                        console.log(err);
                        callback(null, 0);
                    } else if (result.verified === 1) {
                        callback(null, 1);
                    } else {
                        callback(null, 0);
                    }
                })
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
                console.log(row);
                if (password === row.password && row.verified === 1) {
                    console.log('1');
                    callback(null, 1);
                }
                else {
                    callback(null, 0);
                }
            }
        });
    },
    getAllGames: function (username, callback) {
        const getGamesQuery = 'SELECT * FROM Games WHERE username=?';
        db.all(getGamesQuery, [username], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                var arr = []
                for(var i = 0; i < rows.length; i++) {
                    arr.push({id: rows[i].game_id, start_date: rows[i].start_date});
                }
                callback(null, arr);
            }
        });
    },
    getGamesById: function (id, callback) {
        const getGamesQuery = 'SELECT * FROM Games WHERE game_id = ?';
        db.all(getGamesQuery, [id], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                var res = {};
                res.grid = rows.grid.split(",");
                for(var i = 0; i < res.grid.length; i++) {
                    if(res.grid[i] == null) {
                        res.grid[i] = '';
                    }
                }
                res.winner = rows.winner;
                callback(null, res);
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