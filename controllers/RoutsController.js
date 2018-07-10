var config = require('../config.json');
var variables = require('../variables.json');
var strings = require('../strings.json');
var mysql = require('mysql');
var MySQL = require('./MysqlController');
var Session = require('./SessionController');
var View = require('./ViewController');
var support = require('./Support');
var param = function(config, req) {
  var args = {
    "config"    : config, 
    "variables" : variables, 
    "page"      : req.path, 
    "login"     : req.session.login,
    "strings"   : strings
  };
  for (var i = 3; i < arguments.length; i++) {
    args.i = arguments[i];
  }
  return args;
}

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('main-page.ejs');
    });

    app.get('/auth', function (req, res) {
        res.render('main-page.ejs');
    });

    app.post('/auth', function (req, res) {
        MySQL.authenticate(req, res);
    });

    app.get('/login', function (req, res) {
        if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
            res.render('main-page.ejs');
        } else {
            res.redirect("/dictionary");
        }
    });

    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.clearCookie("login");
        res.clearCookie("userid");
        res.clearCookie("username");
        res.redirect("/dictionary");
    });

    app.get('/registration', function (req, res) {
        res.render('main-page.ejs');
    });

    app.get('/dictionary', function (req, res) {
        res.render('main-page.ejs');
    });

    app.delete('/' + config.root, function (req, res) {

    });
    // managing registration post data
    app.post('/registration' + config.root, function (req, res) {
        //res.writeHead(200, {'Content-Type': 'text/html'});
        var reg = MySQL.createUser(req, res);
        res.render('main-page.ejs', { reg: reg });
        res.end();
    });

    app.post('/getfiltersettings', function (req, res) {
        View.getFilterFettings(req, res);
    });

    app.post('/gettablehead', function (req, res) {
        View.getTableHead(req, res);
    });

    app.post('/saveword', function (req, res) {
        View.saveWord(req, res);
    });

    app.post('/checkWord', function (req, res) {
        View.checkWord(req, res);
    })

    app.post('/getdictionarytable', function (req, res) {
        View.renderDictionary(req, res);
    });

    app.post('/getcardplaytype', function (req, res) {
        View.renderPlayType(req, res);
    });

    app.post('/cardplaystart', function (req, res) {
        View.cardPlayStart(req, res);
    });

    app.post('/getfirstcardres', function (req, res) {
        res.send(`  ${res.locals.strings.play_statistic}, 
                    ${res.locals.strings.play_total}, 
                    ${res.locals.strings.play_current}, 
                    ${res.locals.strings.play_results},
                    ${res.locals.strings.play_see},
                    ${res.locals.strings.play_wrong},
                    ${res.locals.strings.play_correct}`);
        res.end();
    });

    app.post('/setwordstat', function (req, res) {
        if (Session.getUser(req).id != null)
            MySQL.setWordStat(req);
    });

    app.post('/getstrings', function (req, res) {
        res.send(res.locals.strings);
        res.end();
    });

    app.post('/setlanguage', function (req, res) {
        Session.setUserLang(req, res);
        var userLangStrings = support.getUserLangStrings(strings, Session.getUserLang(req, res));
        res.locals.strings = userLangStrings;
        res.send("success");
        res.end();
    });

    app.post('/learn', function (req, res) {
        res.render('main-page.ejs');
    });


    app.get('*', function (req, res) {
        res.status(404).render('main-page.ejs', {error: 404});
    });
};











