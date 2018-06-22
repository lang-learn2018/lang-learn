var config = require('../config');
// exports.renderDictionary = function(req, res) {
//     var rating = req.body.rating;
//     var checked = req.body.checked;
//     var wordtypes = req.body.wordType;
//     var rowsCount = req.body.rowsCount;
//     if (typeof req.session.rating == undefined) req.session.rating = "not learned";
//     if (typeof req.session.checked == undefined) req.session.checked = "false";
//     //if(typeof req.session.wordtypes == undefined) req.session.wordtypes = "all";
//     if (typeof req.session.rowsCount == undefined) req.session.rowsCount = 100;
//     if (typeof req.session.wordtypesfilter == "undefined") {
//         req.session.wordtypesfilter = "";
//     }
//
//     if (rating == "not learned" || rating == "ascending" || rating == "descending") {
//         req.session.rating = rating;
//     }
//     if (checked == "true" || checked == "false") {
//         req.session.checked = checked;
//     }
//     if (wordtypes == "verb" || wordtypes == "noun" || wordtypes == "adj" || wordtypes == "frss") {
//         req.session.wordtypesfilter = " AND dictionary_word_type = '" + wordtypes + "' ";
//     } else if (wordtypes == "all") {
//         req.session.wordtypesfilter = "";
//     }
//     if (parseInt(rowsCount)) {
//         req.session.rowsCount = rowsCount;
//     }
//     MySQL.getDictionaryTable();
// }
// exports.drawAuth = function(req, res, rows) {
//     if (rows == 0) {
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write("Error! Incorrect login and/or password.\ " +
//             "<a href='auth'>Try again</a>");
//         res.end();
//         req.session = {};
//         // res.render('main-page.ejs', {"config" : config, "page":req.path});
//     } else {
//         req.session.user = {
//             "userid" : rows[0].users_id,
//             "login" : req.body.login,
//             "name" : rows[0].users_name
//         };
//         req.session.expires = new Date(2000000000);
//         res.redirect("/login");
//     }
// }


