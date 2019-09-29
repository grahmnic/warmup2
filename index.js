var express = require('express');
var fs = require("fs");
var app = express();
var bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
var urlencodedParser = bodyParser.urlencoded({ extended: true })

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db = new sqlite3.Database('warmup2.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the warmup2 database.');
  });

app.get('/ttt', function (req, res) {
   console.log("GET");
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/ttt', urlencodedParser, function (req, res) {
    console.log("POST FORM");
    response = {
       name:req.body.name
    };
    var fileContent = fs.readFileSync(__dirname + "/" + "grid.html", 'utf8');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    fileContent = fileContent.replace("<h2 id='name'>Test</h2>", "<h2 id='name'>Welcome " + response.name + " " + today + "!</h2>")
    res.write(fileContent);
    res.end();
 })

 app.post('/ttt/play', function(req, res) {
    var grid = req.body.grid;
    var winner = null;

    if('X' == grid[0] && 'X' == grid[1] && 'X' == grid[2]) {
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

        if('O' == grid[0] && 'O' == grid[1] && 'O' == grid[2]) {
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
    console.log(grid);
    if(winner == true || winner == false) {
        console.log("SAVE GAME");
    }
    if (grid.filter(x => x == "").length == 0 && winner == null) {
        
    }
    res.send(response);
 })

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})