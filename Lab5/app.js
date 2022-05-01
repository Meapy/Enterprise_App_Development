const express = require('express');
const bodyParser = require("body-parser");
const redis = require('redis');
const session = require('express-session');
var methodOverride = require('method-override')
var router = express.Router();

const app = express();
const port = 5000;
const fs = require('fs');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

app.use(bodyParser.urlencoded({ extended: true }))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/vendor'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 }
    })
);


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});


// load index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
}
);


