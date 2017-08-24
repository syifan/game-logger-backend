const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');

var privateKey = fs.readFileSync('/home/yifan/cert/server.key', 'utf8');
var certificate = fs.readFileSync('/home/yifan/cert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var app = express();
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(18443);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/log', function(req, res) {
    console.log(req.query);
    res.send("");
});