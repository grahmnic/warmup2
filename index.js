var express = require('express');
var fs = require("fs");
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
var path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
const db = require('./db.js');
const nodemailer = require('nodemailer');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ttt', function (req, res) {
    console.log("GET");
    res.sendFile(__dirname + "/" + "index.html");
    if (req.session.loggedin) {
        console.log('Logged in');
        res.sendFile(__dirname + "/" + "logout.html");
    } else {
        console.log('Please login.');
    }
})

app.get('/logout', function (req, res) {
    res.sendFile(__dirname + "/" + "logout.html");
})

app.post('/ttt', urlencodedParser, function (req, res) {
    console.log("POST FORM");
    response = {
        name: req.body.name
    };
    var fileContent = fs.readFileSync(__dirname + "/" + "grid.html", 'utf8');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    fileContent = fileContent.replace("<h2 id='name'>Test</h2>", "<h2 id='name'>Welcome: " + response.name + ", today is " + today + "!</h2>")
    res.write(fileContent);
    res.end();
})

 app.post('/adduser', urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    db.addUser(username, password, email, key, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.status(400).send({
                success: false
            });
        }
        else {
            //SEND EMAIL
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'cloud356ttt@gmail.com',
                    pass: 'cse356-cloud',
                }
            });
            
            let mailOptions = {
                from: 'cloud356ttt@gmail.com',
                to: email,
                subject: 'Verify your email.',
                text: 'validation key: ' + '<' + key + '>',
            };
            
            transporter.sendMail(mailOptions)
                .then(function(response) {
                    console.log('Email sent');
                }).catch(function(error) {
                    console.log('Error ', error);
                });
            res.status(200).send({
                status: "OK"
            });
        }
    });
 })

 app.post('/verify', function(req, res) {
    var email = req.body.email;
    var key = req.body.key;

    db.verify(email, key, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.status(400).send({
                success: false
            });
        }
        else if (result == 1) {
            res.status(200).send({
                status: "OK"
            });
        }
        else {
            res.status(200).send({
                status: "ERROR"
            })
        }
    });
 })

 app.post('/login', function(req, res) {
     var username = req.body.username;
     var password = req.body.password;

     db.login(username, password, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.status(400).send({
                success: false
            });
        }
        else if (result == 1) {   
            req.session.loggedin = true;
            req.session.username = username;
            res.status(200).send({
                status: "OK"
            });    
        }
        else {
            console.log("e");
            res.status(200).send({
                status: "ERROR"
            })
        }
     });
 })

 app.post('/logout', function(req, res) {
    
 })

 app.post('/listgames', function(req, res) {
    db.getAllGames((err, result) => {
        if (err) {
            res.status(200).send({
                status: "ERROR"
            })
        } else {
            res.status(200).send({
                status: "OK",
                games: result
            })
        }
    })
 })

 app.post('/getgame', function(req, res) {
    var id = req.body.id;
    db.getGamesById(id, (err, result) => {
        if(err) {
            res.status(200).send({
                status: "ERROR"
            })
        } else {
            res.status(200).send({
                status: "OK",
                grid: result
            })
        }
    })
 }) 

 app.post('/getscore', function(req, res) {
    db.getScore((err, result) => {
        if(err) {
            res.status(200).send({
                status: "ERROR"
            })
        } else {
            res.status(200).send({
                status: "OK",
                human: result
            })
        }
    })
 });

 app.post('/ttt/play', function(req, res) {
    var grid = req.body.grid;
    var user = req.body.user;
    var winner = null;

    if ('X' == grid[0] && 'X' == grid[1] && 'X' == grid[2]) {
        winner = true;
    } else if ('X' == grid[3] && 'X' == grid[4] && 'X' == grid[5]) {
        winner = true;
    } else if ('X' == grid[6] && 'X' == grid[7] && 'X' == grid[8]) {
        winner = true;
    } else if ('X' == grid[0] && 'X' == grid[3] && 'X' == grid[6]) {
        winner = true;
    } else if ('X' == grid[1] && 'X' == grid[4] && 'X' == grid[7]) {
        winner = true;
    } else if ('X' == grid[2] && 'X' == grid[5] && 'X' == grid[8]) {
        winner = true;
    } else if ('X' == grid[0] && 'X' == grid[4] && 'X' == grid[8]) {
        winner = true;
    } else if ('X' == grid[2] && 'X' == grid[4] && 'X' == grid[6]) {
        winner = true;
    } else {
        // DO RANDOM MOVE
        if(grid.filter(x => x == '').length != 0) {
            var dict = [];
            for(var i = 0; i < grid.length; i++) {
                dict.push({index: i, val: grid[i]});
            }
            dict = dict.filter(x => x.val == '');
            grid[dict[Math.floor(Math.random() * dict.length)].index] = 'O';
        }

        if ('O' == grid[0] && 'O' == grid[1] && 'O' == grid[2]) {
            winner = false;
        } else if ('O' == grid[3] && 'O' == grid[4] && 'O' == grid[5]) {
            winner = false;
        } else if ('O' == grid[6] && 'O' == grid[7] && 'O' == grid[8]) {
            winner = false;
        } else if ('O' == grid[0] && 'O' == grid[3] && 'O' == grid[6]) {
            winner = false;
        } else if ('O' == grid[1] && 'O' == grid[4] && 'O' == grid[7]) {
            winner = false;
        } else if ('O' == grid[2] && 'O' == grid[5] && 'O' == grid[8]) {
            winner = false;
        } else if ('O' == grid[0] && 'O' == grid[4] && 'O' == grid[8]) {
            winner = false;
        } else if ('O' == grid[2] && 'O' == grid[4] && 'O' == grid[6]) {
            winner = false;
        }
    }
    var response = {
        grid: grid,
        winner: winner
    }
    if(winner == true || winner == false || (grid.filter(x => x == "").length == 0 && winner == null)) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        db.addGame(user, today, grid, winner, (err, result) => {
            if (err) {
                console.log(err);
                res.status(400).send({
                    success: false
                });
            }
        });
    }
    res.send(response);
})



var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
