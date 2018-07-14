var mysql = require('mysql');
// var Session = require('./SessionController');
var config = require('../config.json');
var SessionController = require('./SessionController.js');
var Support = require('./Support');
//const translate = require('google-translate-api');
//var googleTranslate = require('google-translate')("AIzaSyA19ETkzItGYg4lgp4lm0HodReC4QsN770");
const translate = require('translate');
translate.engine = 'yandex';
translate.key = config.YANDEX_API_KEY;
var passwordHash = require('password-hash');
var Sync = require('sync');
var Telegram = require('./TelegramController.js');

createConnection = function() {
	var con = mysql.createConnection({
		host: config.host,
		user: config.dbUser,
		password: config.dbPswd,
		database: config.dbName
	});

	con.connect(function(err) {
		if (err) throw err;
		// console.log("Connected!");
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

  var sql = `SELECT * FROM users WHERE users_login = '${req.body.login}'`;
  db.query(sql, function (err, rows) {
    if (err) throw err;
    if (rows == 0) {
      res.writeHead(200, {'Content-Type' : 'text/html'});
      res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
      res.end();
      req.session = {};
    } else {
      if(passwordHash.verify(req.body.password, rows[0].users_password)){
        var user = {
          "login" : rows[0].users_login,
          "name" : rows[0].users_name,
          "id" : rows[0].users_id
        }
        console.log(`User:${user.login}, id:${user.id} authorized`);
        SessionController.createUserSession(req, user);
        res.cookie('login', user.login);
        res.cookie('userid', user.id);
        res.cookie('username', user.name);
        res.redirect("/login");
      } else {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
        res.end();
        req.session = {};
      }
      
    }
  });
  db.end();
}
exports.getDictionaryTable = function(req, res, word) {
  var db = createConnection();
  var user = SessionController.getUser(req);
  var wordfilter = "";
  word = mysql.escape("%"+word+"%");
  // console.log(word);
  if(word != null && word != "" && word != "'%'") {
    wordfilter = ` AND (dictionary_word_he LIKE ${word} OR
                        dictionary_word_en LIKE ${word}) `;
  }
  if(user.id == null) {
    var sqlRatingSum = "'null' AS raiting_sum";
    var sqlCheckWord = "'null' AS raiting_user_check";
  } else {
    var sqlRatingSum = "IFNULL(tRating.raiting_sum, -1) AS raiting_sum";
    var sqlCheckWord = "IFNULL(tRating.raiting_user_check, '0') AS raiting_user_check";
  }
  var lg_sql = "";
  var lg = SessionController.getUserLang(req, res);
  if(lg != "en") lg_sql = ` dictionary.dictionary_word_${lg}, `;
  var sql = ` SELECT *
              FROM (SELECT  dictionary.dictionary_id,
                            dictionary.dictionary_word_he,
                            dictionary.dictionary_word_inf,
                            dictionary.dictionary_word_en,
                            ${lg_sql}
                            dictionary.dictionary_word_tr,
                            dictionary.dictionary_word_type,
                            tRating.raiting_id,
                            IFNULL(tRating.raiting_word_id, '0') AS raiting_word_id,
                            IFNULL(tRating.raiting_user_id, '${user.id}')  AS raiting_user_id,
                            ${sqlCheckWord},
                            ${sqlRatingSum},
                            IFNULL(tRating.raiting_hit, '0') AS raiting_hit,
                            IFNULL(tRating.raiting_miss, '0') AS raiting_miss,
                            IFNULL(tRating.raiting_hit, '0') - IFNULL(tRating.raiting_miss, '0') AS raiting_diff,
                            dictionary.dictionary_user_id
                    FROM  dictionary
                      LEFT JOIN ( SELECT *
                                  FROM  raiting
                                  WHERE raiting_user_id = '${user.id}') AS tRating
                      ON dictionary.dictionary_id = tRating.raiting_word_id) AS dictionary
              WHERE 1=1 ${req.session.wordtypesfilter.where} ${req.session.ratingsfilter.where} ${req.session.wordcheckfilter.where} ${wordfilter} ${req.session.dictfilter.where}`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    if(lg != "en") {
      for(var i = 0; i < result.length; i++){
        if(result[i][`dictionary_word_${lg}`] == "" || result[i][`dictionary_word_${lg}`] == "undefined"){
          var word_id = result[i].dictionary_id;
          var word_en = result[i].dictionary_word_en;

          result[i][`dictionary_word_${lg}`] = setTranslateWord(word_id, word_en, lg)

        }
      }
    };
    res.send(JSON.stringify(result));
    res.end();
    db.end();
  });
}
exports.createUser = function (req, res) {
  return new Promise(function(resolve, reject) {
    var db = createConnection();
    var result = `<div class="alert alert-danger" role="alert">
                    ${res.locals.strings.reg_result_bad}
                  </div>`;
    var sql = ` SELECT * FROM users
                WHERE users_login = '${req.body.login}' AND users_password = '${req.body.password}'`;
    db.query(sql, function (err, rows) {
      if (err) throw err;
      if (rows.length == 0) {
        var dbadd = createConnection();
        var status  = Support.generateRamdomCharacters(8);
        var hashedPassword = passwordHash.generate(req.body.password);
        var sql = `INSERT INTO users
                      (users_name,
                      users_login,
                      users_email,
                      users_password,
                      users_status)
                  VALUES
                      (${mysql.escape(req.body.name)},
                      ${mysql.escape(req.body.login)},
                      ${mysql.escape(req.body.email)},
                      '${hashedPassword}',
                      ${mysql.escape(status)})`;
        dbadd.query(sql, function (err, result) {
          if (err) throw err;
          var linkForActivate = `${res.locals.config.host}:${res.locals.config.port}/activate&id=${status}`;
          Support.sendEmail(res, req.body.email, res.locals.strings.email_registration_sbj, `${res.locals.strings.email_registration_txt}<a href="${linkForActivate}">${linkForActivate}</a>`);
          result = `<div class="alert alert-success" role="alert">
                      ${res.locals.strings.reg_result_good}
                    </div>`;
          resolve(result);
        });
        dbadd.end();
      } else {
        result = `<div class="alert alert-warning" role="alert">
                    ${res.locals.strings.reg_result_exist}
                  </div>`;
        resolve(result);
      }
    });
    db.end();
  });
};
exports.setCheckWord = function(req, word_id, user_check) {
  var sql = `SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_id = ${mysql.escape(word_id)}`;
  db = createConnection();
  db.query(sql, function (err, result) {
    if (err) throw err;
    if (result[0].n == 1) {
      var sql = `SELECT COUNT(*) AS n FROM raiting WHERE raiting_word_id = ${mysql.escape(word_id)} AND raiting_user_id = '${req.session.user.id}'`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        if (result[0].n == 0) {
          var sql = ` INSERT INTO raiting (
                        raiting_word_id,
                        raiting_user_id,
                        raiting_user_check)
                      VALUES (
                        ${mysql.escape(word_id)},
                        '${req.session.user.id}' ,
                        ${mysql.escape(user_check)})`;
        } else {
          var sql = ` UPDATE raiting
                      SET raiting_user_check = ${mysql.escape(user_check)}
                      WHERE raiting_word_id = ${mysql.escape(word_id)} AND
                        raiting_user_id = '${req.session.user.id}'`;
        }
        db.query(sql, function (err, result) {
          if (err) throw err;
        });
        db.end();
      });
    }
  });
}
var isWordNotInDb = (word) => {
  return new Promise((resolve, reject) => {
    var res;
    var db = createConnection();
    var sql = "SELECT COUNT(*) AS n FROM dictionary WHERE dictionary_word_he = " + mysql.escape(word);
    db.query(sql, function (err, result) {
      res = (result[0].n > 0) ? true : false;
      if (err) throw err;
      resolve(res);
      db.end();
    });
  });
}
var setWordToDb = (word_he, word_inf, word_translate, word_lang, word_tr, word_type, user_id) => {
  return new Promise((resolve, reject) => {
    var db = createConnection();
    sql = `INSERT INTO dictionary (
              dictionary_word_he, 
              dictionary_word_inf, 
              dictionary_word_${word_lang}, 
              dictionary_word_tr, 
              dictionary_word_type, 
              dictionary_user_id) 
          VALUES (
              ${mysql.escape(word_he)}, 
              ${mysql.escape(word_inf)}, 
              ${mysql.escape(word_translate)}, 
              ${mysql.escape(word_tr)}, 
              ${mysql.escape(word_type)}, 
              ${mysql.escape(user_id)})`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      resolve(result.insertId);
      var botMessage = `User # ${user_id} added new word into dictionary:
        hebrew: ${word_he} ${word_inf} ${word_tr} (${word_type})
        translate: ${word_translate}
        Do you want to accept this word (send into common dictionary) or delete this word?`;
      Telegram.bot.sendMessage(config.TELEGRAM_ADMIN_ID_1, botMessage, {
        "reply_markup": {
          "inline_keyboard": [
                        [ {text: "Accept", callback_data: `accept:${result.insertId}`} ], 
                        [ {text: "Delete", callback_data: `delete:${result.insertId}`} ]
                      ]
        }
      });
      db.end();
    });
  });
}
exports.setWordDictionaryTable = function(word_he, word_inf, word_translate, word_lang, word_tr, word_type, user_id) {
  return new Promise((resolve, reject) => {
    var msg = "error";
      if (user_id == null) {
        msg = "adding_denied";
        resolve(msg);
      } else {
        isWordNotInDb(word_he).then(res => {
          if (!res) {
            msg = setWordToDb(word_he, word_inf, word_translate, word_lang, word_tr, word_type, user_id);
          } else {
            msg = "exists";
          }
          resolve(msg);
        });
      }
    });
}
exports.updateWord = function(req) {
  return new Promise((resolve, reject) => {
    db = createConnection();
    let sql = ` UPDATE dictionary
                SET dictionary_word_he = ${mysql.escape(req.body.word_he)},
                    dictionary_word_inf = ${mysql.escape(req.body.word_inf)},
                    dictionary_word_${req.body.word_lang} = ${mysql.escape(req.body.word_translate)},
                    dictionary_word_tr = ${mysql.escape(req.body.word_tr)},
                    dictionary_word_type = ${mysql.escape(req.body.word_type)},
                    dictionary_user_id = ${mysql.escape(req.body.word_user_id)}
                WHERE dictionary_id = ${mysql.escape(req.body.word_id)}`;
    console.log(sql);
    db.query(sql, function (err, result) {
      if (err) throw err;
      resolve(true);
    });
  });
}

exports.deleteWord = function(req) {
  return new Promise((resolve, reject) => {
    db = createConnection();
    let sql = ` DELETE FROM dictionary
                WHERE dictionary_id = ${mysql.escape(req.body.word_id)}`;
    console.log(sql);
    db.query(sql, function (err, result) {
      if (err) throw err;
      resolve("success");
    });
  });
}

exports.setWordStat = function (req) {
    var hit = (req.body.hit == 'true');
    var wordId = req.body.wordId;
    var userId = SessionController.getUser(req).id;
    db = createConnection();
    var sql = `
        SELECT  raiting_hit,
                raiting_miss,
                raiting_sum
        FROM    raiting
        WHERE   raiting_word_id = ${mysql.escape(wordId)} AND
                raiting_user_id = ${mysql.escape(userId)}
    `;
    db.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            var hits = JSON.parse(result[0].raiting_hit);
            var misses = JSON.parse(result[0].raiting_miss);
            var rating = parseInt(result[0].raiting_sum);
            if(hit && rating < 5) rating++;
            if(!hit && rating >0) rating--;

            sql = `
                UPDATE  raiting
                SET     raiting_sum = '${rating}'
                WHERE   raiting_word_id = ${mysql.escape(wordId)} AND
                        raiting_user_id = ${mysql.escape(userId)}
            `;
            db.query(sql, function (err, result) {
                if (err) throw err;
            });
        } else {
            var dates = Support.addCurrentDate([]);
            //dates = JSON.stringify(dates);
            if(hit)
              var rating = `1`;
            else
              var rating = `0`;

            sql = `
                INSERT INTO raiting (
                    raiting_word_id,
                    raiting_user_id,
                    raiting_sum
                )
                VALUES (
                    ${mysql.escape(wordId)},
                    ${mysql.escape(userId)},
                    ${rating}
                )`;
            db.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
        db.end();
    });
};

exports.approveWord = (wordId) => {
  return new Promise(function(resolve, reject) {
    var db = createConnection();
    var sql = ` UPDATE dictionary
    SET dictionary_user_id = '0'
    WHERE dictionary_id = ${mysql.escape(wordId)}`;
    console.log(sql);
    db.query(sql, function (err, result) {
      if (err) throw err;
      db.end();
      resolve(true);
    });
  });
}

exports.removeWord = (wordId) => {
  return new Promise(function(resolve, reject) {  
    var db = createConnection();
      var sql = ` DELETE FROM dictionary
                  WHERE dictionary_id = ${mysql.escape(wordId)}`;
      db.query(sql, function (err, result) {
        if (err) throw err;
        db.end();
        resolve(true);
    });
  });  
}

setTranslateWord = async function(word_id, word_en, lg) {
    const text = await translate(word_en, {to: lg} )
    db = createConnection();
    var sql = `
          UPDATE  dictionary
          SET     dictionary_word_${lg} = ${mysql.escape(text)}
          WHERE   dictionary_id = '${mysql.escape(word_id)}'`;
    db.query(sql, function (err, result) {
      if (err) throw err;
      console.log(err);
    });
    db.end();
    return text;
}


// exports.userRegistration = function(req, res) {
//     var db = createConnection();
//     var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         sendEmail(req.body.email, config.reg_mail);

//     });
// };
