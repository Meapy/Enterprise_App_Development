const express = require('express');
var router = express.Router();
var methodOverride = require('method-override')
const app = express();
const port = 5000;
const fs = require('fs');
const bodyParser = require("body-parser");
const { Router } = require('express');
app.use(bodyParser.urlencoded({ extended: true }))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/vendor'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});

// load index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
}
);

