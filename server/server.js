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
        json = JSON.parse(req.query.json);
    } catch (e) {
        res.send(""); // Silently ignore the non-parsable information
    }

    switch (json.type) {
        case 'session_begin':
            handleSessionBegin(json);
            break;
        case 'run_begin':
            handleRunBegin(json);
            break;
        default:
            console.error("Not sure how to deal with log type " + json.type);
    }
    res.send("");
});

function handleSessionBegin(json) {
    connection.query(
        'INSERT INTO game_logger.game_sessions (' +
        '  session_id, player_id, game_name, client_time, detail_begin, detail_end' +
        ') VALUES (' +
        '  ?, ?, ?, ?, ?, ?' +
        ');', [
            json.data.session_id,
            json.data.player_id,
            json.data.game_id,
            json.data.client_time,
            JSON.stringify(json.data.details),
            JSON.stringify({})
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
    connection.query('SELECT game_session_id FROM game_sessions WHERE session_id=?', [json.data.session_id],
        function (error, result) {
            if (error) {
                console.error(error);
                throw error;
            }

            if (result.length == 0) {
                throw new Error("Session id not found");
            }

            let session_id = result[0].game_session_id;


            connection.query(
                'INSERT INTO game_runs (' +
                '  run_id, game_session_id, seqno, client_time, detail_begin, detail_end' +
                ') VALUES (' +
                '  ?, ?, ?, ?, ?, ?' +
                ');', [
                    json.data.run_id,
                    session_id,
                    json.data.run_seqno,
                    json.data.client_time,
                    JSON.stringify(json.data.details),
                    JSON.stringify({})
                ],
                function (error) {
                    if (error) {
                        console.error(error);
                        throw error;
                    }
                })
        })
}
console.log('Server ready');