//var request = require('ajax-request');
var config = require('../config.json');
var variables = require('../variables.json');
var mysql = require('mysql');
var email = require('nodemailer');
var path = require('path');
var ejs = require('ejs');
var db = require('./mysqlController.js').createConnection();
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

module.exports = function(app) {

  app.get('/', function(req, res) {
    // res.writeHead(200, {'Content-Type' : 'text/html'});
    // res.write(req.path);
    // res.end();
    if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
      res.redirect("/login");
    } else {
      res.render('main-page.ejs', param(config,req));   
    }
  });

  app.get('/auth', function(req, res) {
    res.render('main-page.ejs', param(config,req));
  });
    
  app.post('/auth', function(req, res) {
    var sql = "SELECT * FROM users WHERE users_login = '"+ req.body.login +"' AND users_password = '"+ req.body.password +"'";
    db.query(sql, function (err, rows) {
      if (err) throw err;
      if (rows == 0) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
        res.end();   
        req.session = {};
      } else {
        req.session.login = req.body.login;
        req.session.password = req.body.password;
        req.session.userid = rows[0].users_id;
        req.session.usersname = rows[0].users_name;
        req.session.expires = new Date(Date.now() + 36000000*5);
        res.redirect("/login");
      }
    });
  });    
    
  app.get('/login', function(req, res) {
    if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
      res.render('main-page.ejs', param(config,req));
    } else {
      // res.writeHead(200, {'Content-Type' : 'text/html'});
      // res.write("You must to <a href='auth'>authorize</a>");
      // res.end(); 
      res.redirect("/dictionary");
    }
  });

  app.get('/logout', function(req, res) {
      req.session.destroy();
      res.redirect("/dictionary");
  });
    
  app.get('/registration', function(req, res) {
    res.render('main-page.ejs', param(config,req));
  });
    
  app.get('/dictionary', function(req, res) {
    if(typeof req.session.login != undefined && typeof req.session.password != undefined){
      var login = req.session.login;
    } else {
      var username = "";
    }
    res.render('main-page.ejs', param(config,req));
  });

  app.delete('/' + config.root, function(req, res) {
    
  });
  // managing registration post data
  app.post('/registration' + config.root, function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write(req.path);
    var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
    db.query(sql, function (err, result) {
      if (err) throw err;
      sendEmail(req.body.email, 'success registration', 'to activate account go to the link');

    });
    // res.redirect("/dictionary");
    res.end();
  });

  app.post('/saveword', function(req, res){
    if(!req.body) return res.sendStatus(400);
    var word_he = req.body.word_he.replace(/^\s+|\s+$/gm,'');
    var word_inf = req.body.word_inf.replace(/^\s+|\s+$/gm,'');
    var word_en = req.body.word_en.replace(/^\s+|\s+$/gm,'');
    var word_tr = req.body.word_tr.replace(/^\s+|\s+$/gm,'');
    var word_type = req.body.word_type.replace(/^\s+|\s+$/gm,'');
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

  app.post('/checkWord', function(req, res){
    var word_id = req.body.wordID;
    var user_check = req.body.checked;
    user_check == 'true' ? user_check = 1 : user_check = 0;
    var sql = `SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_id = ${mysql.escape(word_id)}`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        if(result[0].n == 1) {
          var sql = `SELECT COUNT(*) AS n FROM raiting WHERE raiting_word_id = ${mysql.escape(word_id)} AND raiting_user_id = ${req.session.userid}`;
          db.query(sql, function (err, result) {
            if (err) throw err;
            if(result[0].n == 0){
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

  app.post('/getdictionarytable', function(req, res){
      var rating = req.body.rating;
      var checked = req.body.checked;
      var wordtypes = req.body.wordType;
      var rowsCount = req.body.rowsCount;
      if(typeof req.session.rating == undefined) req.session.rating = "not learned";
      if(typeof req.session.checked == undefined) req.session.checked = "false";
      //if(typeof req.session.wordtypes == undefined) req.session.wordtypes = "all";
      if(typeof req.session.rowsCount == undefined) req.session.rowsCount = 100;
      
      if (typeof req.session.wordtypesfilter == "undefined") {
        req.session.wordtypesfilter = "";
      }

      if(rating == "not learned" || rating == "ascending" || rating == "descending") {
        req.session.rating = rating;
      }
      if(checked == "true" || checked == "false") {
        req.session.checked = checked;
      }
      if(wordtypes == "verb" || wordtypes == "noun" || wordtypes == "adj" || wordtypes == "frss") {
        req.session.wordtypesfilter = " AND dictionary_word_type = '" + wordtypes +"' ";
      } else if (wordtypes == "all") {
        req.session.wordtypesfilter = "";
      }
      if(parseInt(rowsCount)) {
        req.session.rowsCount = rowsCount;
      }
      var sql = " SELECT  dictionary.dictionary_id, \
                          dictionary.dictionary_word_he, \
                          dictionary.dictionary_word_inf, \
                          dictionary.dictionary_word_en, \
                          dictionary.dictionary_word_tr, \
                          dictionary.dictionary_word_type, \
                          tRating.raiting_id, \
                          IFNULL(tRating.raiting_word_id, '0') AS raiting_word_id, \
                          IFNULL(tRating.raiting_user_id, '"+req.session.userid+"')  AS raiting_user_id, \
                          IFNULL(tRating.raiting_user_check, 'false') AS raiting_user_check, \
                          IFNULL(tRating.raiting_sum, '0') AS raiting_sum \
                  FROM  dictionary \
                  LEFT JOIN ( SELECT * \
                              FROM  raiting \
                              WHERE raiting_user_id = '" + req.session.userid + "' ) AS tRating \
                    ON dictionary.dictionary_id = tRating.raiting_word_id \
                  WHERE 1=1 " + req.session.wordtypesfilter + "\
                ";
      db.query(sql, function (err, result) {
        if (err) throw err;
        res.send(JSON.stringify(result));
        res.end();
      });
  });


  app.get('*', function(req, res) {
    res.status(404).render('main-page.ejs', param(config,req));
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










