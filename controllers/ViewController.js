var config = require('../config');
var MySQL = require('./MysqlController.js');

exports.renderDictionary = function(req, res) {
    var rating = req.body.rating;
    var checked = req.body.checked;
    var wordtypes = req.body.wordType;
    var rowsCount = req.body.rowsCount;
    var word = req.body.word;
    if (typeof req.session.rating == "undefined") req.session.rating = "all";
    if (typeof req.session.checked == "undefined") req.session.checked = "all";
    if (typeof req.session.wordtypes == "undefined") req.session.wordtypes = "all";
    if (rating != "") req.session.rating = rating;
    if (checked != "") req.session.checked = checked;
    if (wordtypes != "") req.session.wordtypes = wordtypes;



    if (typeof req.session.rowsCount == "undefined") req.session.rowsCount = 100;
    if (typeof req.session.wordtypesfilter == "undefined") req.session.wordtypesfilter = "";
    if (typeof req.session.ratingsfilter == "undefined") req.session.ratingsfilter = "";
    if (typeof req.session.wordcheckfilter == "undefined") req.session.wordcheckfilter = "";

    if (wordtypes == "verb" || wordtypes == "noun" || wordtypes == "adj" || wordtypes == "frss") {
        req.session.wordtypesfilter = " AND dictionary_word_type = '" + wordtypes + "' ";
    } else if (wordtypes == "all") {
        req.session.wordtypesfilter = "";
    }
    switch(rating) {
    	case "not learned":
	    	req.session.ratingsfilter = " AND raiting_hit = 0 AND raiting_miss = 0 ";
	    	break;
    	case "hit":
	    	req.session.ratingsfilter = " AND raiting_diff > 0 ";
	    	break;
    	case "miss":
	    	req.session.ratingsfilter = "  AND raiting_diff <= 0  ";
	    	break;
	    case "all":
	    	req.session.ratingsfilter = "";
	    	break;
    }
    switch (checked) {
    	case "checked":
    		req.session.wordcheckfilter = " AND raiting_user_check = '1' ";
    		break;
    	case "not checked":
    		req.session.wordcheckfilter = " AND raiting_user_check = '0' ";
    		break;
    	case "all":
    		req.session.wordcheckfilter = "";
    		break;
    }
   
    if (parseInt(rowsCount)) {
        req.session.rowsCount = rowsCount;
    }
    MySQL.getDictionaryTable(req, res, word);
}
exports.drawAuth = function(req, res, rows) {
    if (rows == 0) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("Error! Incorrect login and/or password.\ " +
            "<a href='auth'>Try again</a>");
        res.end();
        req.session = {};
        // res.render('main-page.ejs', {"config" : config, "page":req.path});
    } else {
        req.session.user = {
            "userid" : rows[0].users_id,
            "login" : req.body.login,
            "name" : rows[0].users_name
        };
        req.session.expires = new Date(2000000000);
        res.redirect("/login");
    }
}

exports.checkWord = function(req, res) {
	var word_id = req.body.wordID;
    var user_check = req.body.checked;
    user_check == 'true' ? user_check = 1 : user_check = 0;
    MySQL.setCheckWord(req, word_id, user_check);
}

exports.saveWord = function(req, res) {
	var word_he = req.body.word_he.replace(/^\s+|\s+$/gm, '');
	var word_inf = req.body.word_inf.replace(/^\s+|\s+$/gm, '');
	var word_en = req.body.word_en.replace(/^\s+|\s+$/gm, '');
	var word_tr = req.body.word_tr.replace(/^\s+|\s+$/gm, '');
	var word_type = req.body.word_type.replace(/^\s+|\s+$/gm, '');
	if (word_type != "verb") {
		word_inf = "";
	}
	var answer = MySQL.setWordDictionaryTable(word_he, word_inf, word_en, word_tr, word_type, word_inf);
	res.send(answer);
    res.end();
}

exports.getFilterFettings = function(req, res) {
	if (typeof req.session.rating == "undefined") req.session.rating = "all";
    if (typeof req.session.checked == "undefined") req.session.checked = "all";
    if (typeof req.session.wordtypes == "undefined") req.session.wordtypes = "all";
    

	res.send("<div class='' role='alert'><strong>Filter settings</strong>: Word raiting <u>"+req.session.rating+"</u>; Checked <u>"+req.session.checked+"</u>; Type <u>"+req.session.wordtypes)+"</u></div>";
    res.end();
}


