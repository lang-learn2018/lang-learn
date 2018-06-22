var mysql = require('mysql');
// var Session = require('./SessionController');
var config = require('../config.json');

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

exports.getDictionaryTable = function(req, res) {
    var db = createConnection();
    var sql = " SELECT  dictionary.dictionary_id, \
                          dictionary.dictionary_word_he, \
                          dictionary.dictionary_word_inf, \
                          dictionary.dictionary_word_en, \
                          dictionary.dictionary_word_tr, \
                          dictionary.dictionary_word_type, \
                          tRating.raiting_id, \
                          IFNULL(tRating.raiting_word_id, '0') AS raiting_word_id, \
                          IFNULL(tRating.raiting_user_id, '" + req.session.userid + "')  AS raiting_user_id, \
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
    db.end();
}
// exports.isUserCorrect = function (login, password) {
//     var db = createConnection();
//     var sql = `SELECT * FROM users WHERE users_login = '${login} '
//                 AND users_password = '${password}'`;
//     db.query(sql, function (err, rows) {
//         if (err) throw err;
//         if (rows == 0) {
//             return false;
//         }
//         return true;
//     });
//     db.end(function (err) {
//         console.log('something went wrong!');
//     });
// };

// exports.userRegistration = function(req, res) {
//     var db = createConnection();
//     var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
//     db.query(sql, function (err, result) {
//         if (err) throw err;
//         sendEmail(req.body.email, 'success registration', 'to activate account go to the link');
//
//     });
// };