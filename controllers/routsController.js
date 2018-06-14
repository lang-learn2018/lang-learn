var config = require('../config.json');
var url = require('url');
var mysql = require('mysql');
var email = require('nodemailer');
var path = require('path');

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
    con.query(sql, function (err, rows, result) {
      if (err) throw err;
      if (rows == 0) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
        res.end();   
        req.session = {};
      } else {
        req.session.login = req.body.login;
        req.session.password = req.body.password;
        req.session.username = result[0].users_name;
        req.session.expires = new Date(Date.now() + 3600000*5);
        res.redirect("/login");
      }
    });
  });    

    
  app.get('/login', function(req, res) {
    if(typeof req.session.login !== "undefined" && typeof req.session.password !== "undefined"){
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










