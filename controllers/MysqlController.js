var mysql = require('mysql');
// var Session = require('./SessionController');
var config = require('../config.json');
var SessionController = require('./SessionController.js');

createConnection = function() {
	var con = mysql.createConnection({
		host: config.host,
		user: config.dbUser,
		password: config.dbPswd,
		database: config.dbName
	});
	
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
	});
	return con;
};
/**
 * check if @user with such login exists in data base
 * @user - JSON object, which contains user.id; user.name; user.email; user.login
 * @return: true - if user exists in db / false - if not
 */
 exports.authenticate = function(req, res) {
  var db = createConnection();
  var sql = `SELECT * FROM users WHERE users_login = '${req.body.login}' 
  AND users_password = '${req.body.password}'`;
  db.query(sql, function (err, rows) {
    if (err) throw err;
    if (rows == 0) {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
      res.end();
      req.session = {};
    } else {
      var user = {
        "login" : rows[0].users_login,
        "name" : rows[0].users_name,
        "id" : rows[0].users_id
      }
      req.session.user = user;
      req.session.expires = new Date(Date.now() + 36000000*5);
      res.cookie('login', user.login);
      res.cookie('userid', user.id);
      res.cookie('username', user.name);
      res.redirect("/login");

    }
  });
  db.end();
}

exports.getDictionaryTable = function(req, res, word) {
  var db = createConnection();
  var user = SessionController.getUser(req);
  var wordfilter = "";
  word = mysql.escape(word+"%");
  console.log(word);
  if(word != null && word != "" && word != "'%'") {
    wordfilter = ` AND (dictionary_word_he LIKE ${word} OR 
                        dictionary_word_en LIKE ${word}) `;
  }
  var sql = ` SELECT *
              FROM (SELECT  dictionary.dictionary_id, 
                            dictionary.dictionary_word_he, 
                            dictionary.dictionary_word_inf, 
                            dictionary.dictionary_word_en, 
                            dictionary.dictionary_word_tr, 
                            dictionary.dictionary_word_type, 
                            tRating.raiting_id, 
                            IFNULL(tRating.raiting_word_id, '0') AS raiting_word_id, 
                            IFNULL(tRating.raiting_user_id, ${user.id})  AS raiting_user_id, 
                            IFNULL(tRating.raiting_user_check, '0') AS raiting_user_check, 
                            IFNULL(tRating.raiting_sum, '0') AS raiting_sum,
                            IFNULL(tRating.raiting_hit, '0') AS raiting_hit,
                            IFNULL(tRating.raiting_miss, '0') AS raiting_miss, 
                            IFNULL(tRating.raiting_hit, '0') - IFNULL(tRating.raiting_miss, '0') AS raiting_diff
                    FROM  dictionary 
                      LEFT JOIN ( SELECT * 
                                  FROM  raiting 
                                  WHERE raiting_user_id = ${user.id}) AS tRating 
                      ON dictionary.dictionary_id = tRating.raiting_word_id) AS dictionary
              WHERE 1=1 ${req.session.wordtypesfilter} ${req.session.ratingsfilter} ${req.session.wordcheckfilter} ${wordfilter}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
    console.log(sql);
    res.end();
  });
  db.end();
}
exports.createUser = function (login, password) {
  var db = createConnection();
  var sql = `SELECT * FROM users WHERE users_login = '${login} '
  AND users_password = '${password}'`;
  db.query(sql, function (err, rows) {
    if (err) throw err;
    if (rows != 0) {
      var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
      db.query(sql, function (err, result) {
        if (err) throw err;
        sendEmail(req.body.email, config.reg_mail);
      });
    }
  });
  db.end(function (err) {
    console.log('something went wrong!');
  });
};

exports.setCheckWord = function(req, word_id, user_check) {
  var sql = `SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_id = ${mysql.escape(word_id)}`;
  db = createConnection();
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result[0].n == 1) {
      var sql = `SELECT COUNT(*) AS n FROM raiting WHERE raiting_word_id = ${mysql.escape(word_id)} AND raiting_user_id = ${req.session.user.id}`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        if (result[0].n == 0) {
          var sql = ` INSERT INTO raiting ( 
                        raiting_word_id, 
                        raiting_user_id, 
                        raiting_user_check) 
                      VALUES ( 
                        ${mysql.escape(word_id)},
                        ${req.session.user.id} ,
                        ${mysql.escape(user_check)})`;
        } else {
          var sql = ` UPDATE raiting 
                      SET raiting_user_check = ${mysql.escape(user_check)}
                      WHERE raiting_word_id = ${mysql.escape(word_id)} AND 
                        raiting_user_id = ${req.session.user.id}`;
        }
        db.query(sql, function (err, result) {
          if (err) throw err;
        });
        db.end();
      });
    }
  });
}

exports.setWordDictionaryTable = function(word_he, word_inf, word_en, word_tr, word_type, word_inf) {
  var sql = "SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_word_he = " + mysql.escape(word_he);
  db = createConnection();
  var answer = "error";
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result[0].n > 0) {
      answer = "exists";
      db.end();
    } else {
      if (word_he != "" && word_en != "" && word_type != "") {
        sql = "INSERT INTO dictionary (dictionary_word_he, dictionary_word_inf, dictionary_word_en, dictionary_word_tr, dictionary_word_type) VALUES (" + mysql.escape(word_he) + ", " + mysql.escape(word_inf) + ", " + mysql.escape(word_en) + ", " + mysql.escape(word_tr) + ", " + mysql.escape(word_type) + ")";
        console.log(sql);
        db.query(sql, function (err, result) {
          if (err) throw err;
          answer = "success";
          db.end();
        });
      }
    }
  });
  return answer;
}

// exports.userRegistration = function(req, res) {
//     var db = createConnection();
//     var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         sendEmail(req.body.email, config.reg_mail);

//     });
// };