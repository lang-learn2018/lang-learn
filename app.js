var config = require('./config.json');
var express = require('express');
var router = require('./controllers/routsController');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var url = require('url');
var mysql = require('mysql');
var email = require('nodemailer');
var path = require('path');
var ejs = require('ejs');



var app = express();
app.set('view-engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'supersecret'
}));

router(app);

app.listen(config.port, () => console.log('Example app listening on port ' + config.port + '!'));
