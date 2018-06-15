var config = require('../config.json');
var url = require('url');
var mysql = require('mysql');
var email = require('nodemailer');
var path = require('path');
var ejs = require('ejs')

// var stringMultiline = require('string-multiline');
// stringMultiline.parseMultilineVars('./data/somedata.dat', function(result){
//     console.log(result);
// });
//var request = require('ajax-request');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: config.dbPswd,
  database: config.dbName
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = function(app) {

  app.get('/', function(req, res) {
    // res.writeHead(200, {'Content-Type' : 'text/html'});
    // res.write(req.path);
    // res.end();
    if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
      res.redirect("/login");
    } else {
      res.render('main-page.ejs', {"config" : config, "page" : req.path});   
    }
  });

  app.get('/auth', function(req, res) {
    res.render('main-page.ejs', {"config" : config, "page" : req.path});
  });
    
  app.post('/auth', function(req, res) {
    var sql = "SELECT * FROM users WHERE users_name = '"+ req.body.login +"' AND users_password = '"+ req.body.password +"' ";
    con.query(sql, function (err, rows) {
      if (err) throw err;
      if (rows == 0) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
        res.end();   
        req.session = {};
      } else {
        req.session.login = req.body.login;
        req.session.password = req.body.password;
        req.session.expires = new Date(Date.now() + 3600000*5);
        res.redirect("/login");
      }
    });
  });    
    
  app.get('/login', function(req, res) {
    if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
      console.log("Logit: "+req.session.login+" Password: "+req.session.password+" Username: "+req.session.usernames);
      res.render('main-page.ejs', {"config" : config, "page" : req.path});
    } else {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.write("You must to <a href='auth'>authorize</a>");
      res.end();   
    }
  });
    
  app.get('/registration', function(req, res) {
    res.render('main-page.ejs', {"config" : config, "page" : req.path});
  });
    
  app.get('/dictionary', function(req, res) {
    if(typeof req.session.login != undefined && typeof req.session.password != undefined){
      var login = req.session.login;
    } else {
      var username = "";
    }
    res.render('main-page.ejs', {"config" : config, "page" : req.path, "login": login});
  });

  app.delete('/' + config.root, function(req, res) {
    
  });
  // managing registration post data
  app.post('/registration' + config.root, function(req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write(req.path);
    var sql = "INSERT INTO users (users_name, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      sendEmail(req.body.email, 'success registration', 'to activate account go to the link');
    });
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
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result[0].n > 0) {
        answer = "exists";
        // console.log(answer);
        res.send(answer);
        // res.write(answer);
        res.end();
      } else {
        if (word_he != "" && word_en != "" && word_type != "") {
          sql = "INSERT INTO dictionary (dictionary_word_he, dictionary_word_inf, dictionary_word_en, dictionary_word_tr, dictionary_word_type) VALUES (" + mysql.escape(word_he) + ", " + mysql.escape(word_inf) + ", " + mysql.escape(word_en) + ", " + mysql.escape(word_tr) + ", " + mysql.escape(word_type) + ")";
          con.query(sql, function (err, result) {
            if (err) throw err;
            answer = "success";
            res.send(answer);
            res.end();
          });
        }
      }
      console.log("answer: " + answer);
      // res.writeHead(200, {'Content-Type' : 'text/html'});
      // res.send(answer);
    });
  });

  app.post('/getdictionarytable', function(req, res){
      var rating = req.body.rating;
      var checked = req.body.checked;
      var wordtypes = req.body.wordtypes;
      var rowsCount = req.body.rowsCount;
      if(typeof req.session.rating == undefined) req.session.rating = "not learned";
      if(typeof req.session.checked == undefined) req.session.checked = "false";
      if(typeof req.session.wordtypes == undefined) req.session.wordtypes = "all";
      if(typeof req.session.rowsCount == undefined) req.session.rowsCount = 100;
      if(rating == "not learned" || rating == "ascending" || rating == "descending") {
        req.session.rating = rating;
      }
      if(checked == "true" || checked == "false") {
        req.session.checked = checked;
      }
      if(wordtypes == "all" || wordtypes == "verbs" || wordtypes == "nouns" || wordtypes == "adjective" || wordtypes == "frases") {
        req.session.wordtypes = wordtypes;
      }
      if(parseInt(rowsCount)) {
        req.session.rowsCount = rowsCount;
      }
      var sql = "SELECT dictionary_id, \
                        dictionary_word_he, \
                        dictionary_word_inf, \
                        dictionary_word_en, \
                        dictionary_word_tr, \
                        dictionary_word_type \
                FROM  dictionary \
                  LEFT JOIN 



                raiting ON dictionary.dictionary_id 
                ";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        res.send(JSON.stringify(result));
        res.end();
      });
  });


  app.get('*', function(req, res) {
    res.status(404).render('main-page.ejs', {"config" : config, "page" : "404"});
  });
};

var sendEmail = function(emailAdr, sbj, txt) {
  var transporter = email.createTransport({
  service: 'gmail',
  auth: {
    user: 'config.email',
    pass: 'config.emailPass'
  }
  });
  var mailOptions = {
    from: 'learnhebrew1234@gmail.com',
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










