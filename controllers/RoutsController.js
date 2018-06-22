var config = require('../config.json');
var variables = require('../variables.json');
var mysql = require('mysql');
var email = require('nodemailer');
var MySQL1 = require('./MysqlController');
var Session = require('./SessionController');
var View = require('./ViewController');
var param = function(config, req) {
  var args = {
    "config"    : config, 
    "variables" : variables, 
    "page"      : req.path, 
    "login"     : req.session.login
  };
  for (var i = 3; i < arguments.length; i++) {
    args.i = arguments[i];
  }
  return args;
}

module.exports = function (app) {
    app.get('/', function (req, res) {
        // if (Session.isUserSessionExists(req)) {
        //     res.redirect("/login");
        // } else {
        // }
        // console.log(req.cookie.login);
        res.render('main-page.ejs');
    });

    app.get('/auth', function (req, res) {
        res.render('main-page.ejs');
    });

    app.post('/auth', function (req, res) {
        MySQL1.authenticate(req, res);
        // console.log('2');
        // res.cookie('login', req.body.login);
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
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(req.path);
        // var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
        // db.query(sql, function (err, result) {
        //     if (err) throw err;
        //     sendEmail(req.body.email, 'success registration', 'to activate account go to the link');
        //
        // });
        // res.redirect("/dictionary");
        res.end();
    });

    app.post('/saveword', function (req, res) {
        if (!req.body) return res.sendStatus(400);
        var word_he = req.body.word_he.replace(/^\s+|\s+$/gm, '');
        var word_inf = req.body.word_inf.replace(/^\s+|\s+$/gm, '');
        var word_en = req.body.word_en.replace(/^\s+|\s+$/gm, '');
        var word_tr = req.body.word_tr.replace(/^\s+|\s+$/gm, '');
        var word_type = req.body.word_type.replace(/^\s+|\s+$/gm, '');
        if (word_type != "verb") {
            word_inf = "";
        }
        var answer = "";
        var sql = "SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_word_he = " + mysql.escape(word_he);
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (result[0].n > 0) {
                answer = "exists";
                res.send(answer);
                res.end();
            } else {
                if (word_he != "" && word_en != "" && word_type != "") {
                    sql = "INSERT INTO dictionary (dictionary_word_he, dictionary_word_inf, dictionary_word_en, dictionary_word_tr, dictionary_word_type) VALUES (" + mysql.escape(word_he) + ", " + mysql.escape(word_inf) + ", " + mysql.escape(word_en) + ", " + mysql.escape(word_tr) + ", " + mysql.escape(word_type) + ")";
                    db.query(sql, function (err, result) {
                        if (err) throw err;
                        answer = "success";
                        res.send(answer);
                        res.end();
                    });
                }
            }
            console.log("answer: " + answer);
        });
    });

    app.post('/checkWord', function (req, res) {
        var word_id = req.body.wordID;
        var user_check = req.body.checked;
        user_check == 'true' ? user_check = 1 : user_check = 0;
        var sql = `SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_id = ${mysql.escape(word_id)}`;
        db.query(sql, function (err, result) {
            if (err) throw err;
            if (result[0].n == 1) {
                var sql = `SELECT COUNT(*) AS n FROM raiting WHERE raiting_word_id = ${mysql.escape(word_id)} AND raiting_user_id = ${req.session.userid}`;
                db.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result[0].n == 0) {
                        var sql = ` INSERT INTO raiting ( 
                            raiting_word_id, 
                            raiting_user_id, 
                            raiting_user_check) 
                          VALUES ( 
                            ${mysql.escape(word_id)},
                            ${req.session.userid} ,
                            ${mysql.escape(user_check)})`;
                    } else {
                        var sql = ` UPDATE raiting 
                          SET raiting_user_check = ${mysql.escape(user_check)}
                          WHERE raiting_word_id = ${mysql.escape(word_id)} AND 
                                raiting_user_id = ${req.session.userid}`;
                    }
                    db.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                });
            }
        });
    })

    app.post('/getdictionarytable', function (req, res) {
        // View.renderDictionary(req, res);
    });


    app.get('*', function (req, res) {
        res.status(404).render('main-page.ejs', param(config, req));
    });
};

var sendEmail = function(emailAdr, sbj, txt) {
  var transporter = email.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.emailPass
  }
  });
  var mailOptions = {
    from: config.email,
    to: emailAdr,
    subject: sbj,
    text: txt
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}










