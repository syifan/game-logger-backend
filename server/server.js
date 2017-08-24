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
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'game_logger'
    });

    connection.connect();
    return connection;
}

function initServer() {
    let privateKey = fs.readFileSync('/home/yifan/cert/server.key', 'utf8');
    let certificate = fs.readFileSync('/home/yifan/cert/server.crt', 'utf8');

    let credentials = {
        key: privateKey,
        cert: certificate
    };

    let app = express();
    let httpsServer = https.createServer(credentials, app);
    httpsServer.listen(18443);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    return app;
}

app.get('/api/log', function (req, res) {

    let json;

    try {
        console.log(req.query.json);
        json = JSON.parse(req.query.json);
    } catch (e) {
        console.error(e);
        res.send(""); // Silently ignore the non-parsable information
        return;
    }

    switch (json.type) {
        case 'session_begin':
            handleSessionBegin(json);
            break;
        case 'run_begin':
            handleRunBegin(json);
            break;
        case 'action':
            handleAction(json);
            break;
        case 'run_end':
            handleRunEnd(json);
            break;
        case 'session_end':
            handleSessionEnd(json);
            break;
        default:
            console.error("Not sure how to deal with log type " + json.type);
    }
    res.send("");
});

function handleSessionBegin(json) {
    connection.query(
        'INSERT INTO sessions (' +
        '  session_id, player_id, game_name, begin_time, detail_begin' +
        ') VALUES (' +
        '  ?, ?, ?, ?, ?' +
        ');', [
            json.data.session_id,
            json.data.player_id,
            json.data.game_id,
            json.data.client_time,
            JSON.stringify(json.data.details),
        ],
        function (error, result) {
            if (error) {
                console.error(error);
                throw error;
            }
            console.log(result);
        }
    );
}

function handleRunBegin(json) {
    connection.query(
        'INSERT INTO runs (' +
        '  run_id, session_id, seqno, begin_time, detail_begin' +
        ') VALUES (' +
        '  ?, ?, ?, ?, ?' +
        ');', [
            json.data.run_id,
            json.data.session_id,
            json.data.run_seqno,
            json.data.client_time,
            JSON.stringify(json.data.details),
        ],
        function (error) {
            if (error) {
                console.error(error);
                throw error;
            }
        })
}

function handleAction(json) {
    connection.query(
        `INSERT INTO actions (
          run_id, detail, client_time, seqno
        ) VALUES (
          ?, ?, ?, ?
        )`, [
            json.data.run_id, 
            JSON.stringify(json.data.details),
            json.data.client_time,
            json.data.action_seqno,
        ], function(error) {
            if (error) {
                console.error(error);
                throw error;
            }
        }
    )
}

function handleRunEnd(json) {
    connection.query(
        `UPDATE runs SET
             end_time = ?, 
             detail_end = ?
        WHERE
            run_id = ?;`, 
        [
            json.data.client_time, 
            JSON.stringify(json.data.details),
            json.data.run_id,
        ], function(error) {
            if (error) {
                console.error(error);
                throw error;
            }
        }
    );
}

function handleSessionEnd(json) {
    connection.query(
        `UPDATE sessions SET
             end_time = ?, 
             detail_end = ?
        WHERE
            session_id = ?;`, 
        [
            json.data.client_time, 
            JSON.stringify(json.data.details),
            json.data.session_id,
        ], function(error) {
            if (error) {
                console.error(error);
                throw error;
            }
        }
    );

}

console.log('Server ready');