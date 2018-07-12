var config = require('./config.json');
var strings = require('./strings.json');
var express = require('express');
var router = require('./controllers/RoutsController');
var support = require('./controllers/Support');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var SessionController = require('./controllers/SessionController');
// var bot = require('../TelegramController.js');

var app = express();
app.set('view-engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: config.sessionSecret
}));
app.use(cookieParser());

app.use(function(req, res, next) {
	var userLangStrings = support.getUserLangStrings(strings, SessionController.getUserLang(req, res));
    res.locals.login = SessionController.getUser(req).login;
    res.locals.userid = SessionController.getUser(req).id;
    res.locals.path = req.path;
    res.locals.config = config;
    res.locals.strings = userLangStrings;
    SessionController.getUserLang(req, res);
    next();
});
router(app);
app.listen(config.port, () => console.log('Listening on port ' + config.port + '!'));
