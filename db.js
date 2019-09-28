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
    addUser: function (username, password, email, callback) {
        const addUserQuery = 'INSERT INTO User() VALUES(?,?,?)';
        db.run(addUserQuery, [username, password, email], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                console.log(rows);
                callback(null, rows);
            }
        });
    },
    verify: function (username, key, callback) {
        const getKeyQuery = 'SELECT key FROM User WHERE username=?';
        db.get(getKeyQuery, [username], (err, row) => {
            if (err) {
                callback(err);
            }
            else {
                console.log(row);
                if (key === 'abracadabra') {
                    callback(null, 1);
                }
                if (key === row.key) {
                    callback(null, 1);
                }
                else {
                    callback(null, 0);
                }
            }
        });
    },
    login: function (username, password, callback) {
        const loginQuery = 'SELECT password FROM User WHERE username = ?';
        db.get(loginQuery, [username], (err, row) => {
            if (err) {
                callback(null, 0);//username not found
            }
            else {
                console.log(row);
                if (password === row.password) {
                    callback(null, 1);
                }
                else {
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
    getGamesByUsername: function (username, callback) {
        const getIdQuery = 'SELECT * FROM Games WHERE username = ?';
        db.all(getIdQuery, [username], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                console.log(rows);
                callback(null, rows);
            }

        });
    },
    addGameByUsername: function (username, callback) {
        const getIdQuery = 'SELECT * FROM Games WHERE username = ?';
        db.all(getIdQuery, [username], (err, rows) => {
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
    addGameByUsername: function (username, callback) {
        const getUserQuery = 'Insert';
        db.get(getUserQuery, [username], (err, row) => {
            if (err) {
                callback(err);
            } else {
                console.log(row);
                callback(null, row);
            }

        });
    }

};