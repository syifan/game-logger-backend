'use strict';
const fs = require('fs');
const https = require('https');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

var connection = initDB()
var app = initServer();

function initDB() {
    let connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'game_logger'
    });
    
    connection.connect();
    return connection;
}

function initServer() {
    let privateKey = fs.readFileSync('/home/yifan/cert/server.key', 'utf8');
    let certificate = fs.readFileSync('/home/yifan/cert/server.crt', 'utf8');

    let credentials = {key: privateKey, cert: certificate};

    let app = express();
    let httpsServer = https.createServer(credentials, app);
    httpsServer.listen(18443);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    return app;
}

app.get('/api/log', function(req, res) {
    console.log(req.query);

    connection.query("SELECT * FROM game_logger.game_runs WHERE run_id='a'", function(error, result, fields) {
        if (error) throw error;
        console.log(result);
    })

    res.send("");
});

console.log('Server ready');