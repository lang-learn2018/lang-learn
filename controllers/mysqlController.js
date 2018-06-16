var mysql = require('mysql');
var config = require('../config.json');

module.exports.createConnection = function() {
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

// module.exports.authorize = function(db) {
// 	var sql = "SELECT * FROM users WHERE users_login = '"+ req.body.login +"' AND users_password = '"+ req.body.password +"'";
// 	db.query(sql, function (err, rows) {
//       if (err) throw err;
//       if (rows == 0) {
//         res.writeHead(200, {'Content-Type' : 'text/html'});
//         res.write("Error! Incorrect login and/or password. <a href='auth'>Try again</a>");
//         res.end();   
//         req.session = {};
//       } else {
//         req.session.login = req.body.login;
//         req.session.password = req.body.password;
//         req.session.userid = rows[0].users_id;
//         req.session.usersname = rows[0].users_name;
//         req.session.expires = new Date(Date.now() + 36000000*5);
//         res.redirect("/login");
//       }
//     });
// }

// module.exports.createUser = function(db) {
// 	var sql = "INSERT INTO users (users_name, users_login, users_email, users_password, users_status) VALUES (" + mysql.escape(req.body.name) + "," + mysql.escape(req.body.login) + "," + mysql.escape(req.body.email) + "," + mysql.escape(req.body.pass) + ", 'CREATED')";
//     db.query(sql, function (err, result) {
//       if (err) throw err;
//       sendEmail(req.body.email, 'success registration', 'to activate account go to the link');

//     });
// }

// module.exports.

