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
    // Get all menu sections
    getAllMenuSections: function (callback) {
        const getAllQuery = 'SELECT * FROM menusection';
        db.all(getAllQuery, [], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                let MenuSection = [];

                rows.forEach((row) => {
                    MenuSection.push(row);
                    //console.log(row);
                });
                callback(null, MenuSection);
                //console.log(MenuSection);
            }
        });
    },
    // Get menu section by ID
    getMenuSectionById: function (id, callback) {
        const getIdQuery = 'SELECT * FROM menusection WHERE id=?';
        db.all(getIdQuery, [id], (err, rows) => {
            if (err) {
                //console.log(err);
                //throw err;//CATCH
                callback(err);
            }
            else {
                let MenuSection = [];

                rows.forEach((row) => {
                    MenuSection.push(row);
                    console.log(row);
                });
                console.log(MenuSection);
                callback(null, MenuSection);
            }
        });
    },
    //Add menu section with name, increment ID
    addMenuSection: function (name, callback) {
        const getIdQuery = 'INSERT INTO menusection(name) VALUES(?)';
        db.all(getIdQuery, [name], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                const getNewEntryQuery = 'SELECT * FROM menusection WHERE name=?';
                db.all(getNewEntryQuery, [name], (error, rows) => {
                    if (error) {
                        callback(error);
                    }
                    else {
                        let MenuSection = [];
                        rows.forEach((row) => {
                            MenuSection.push(row);
                        });
                        callback(null, MenuSection);
                    }
                });
            }
        });
    },
    //Edit name of menu section at ID
    editMenuSection: function (id, name, callback) {
        const getIdQuery = 'UPDATE menusection SET name=? WHERE id=?';
        db.all(getIdQuery, [name, id], (err, rows) => {
            if (err) {
                callback(err);
            }
            else {
                const getNewEntryQuery = 'SELECT * FROM menusection WHERE id=?';
                db.all(getNewEntryQuery, [id], (error, rows) => {
                    if (error) {
                        callback(error);
                    }
                    else {
                        let MenuSection = [];
                        rows.forEach((row) => {
                            MenuSection.push(row);
                        });
                        callback(null, MenuSection);
                    }
                });
            }
        });
    },
    //Delete tuple with id
    deleteMenuSection: function (id, callback) {
        const getIdQuery = 'DELETE FROM menusection WHERE id=?';
        db.all(getIdQuery, [id], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }

        });
    }
};