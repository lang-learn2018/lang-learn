var config = require('../config');
var strings = require('../strings');
var MySQL = require('./MysqlController.js');
var SessionController = require('./SessionController.js');

exports.renderDictionary = function(req, res) {
    var rating = req.body.rating;
    var checked = req.body.checked;
    var wordtypes = req.body.wordType;
    var rowsCount = req.body.rowsCount;
    if(typeof req.body.dict == "undefined" || SessionController.getUser(req).id != "admin")
        var dict= "standart";
    else
        var dict = req.body.dict;
    var word = req.body.word;
    if (typeof req.session.rating == "undefined") req.session.rating = "all";
    if (typeof req.session.checked == "undefined") req.session.checked = "all";
    if (typeof req.session.wordtypes == "undefined") req.session.wordtypes = "all";
    if (typeof req.session.dict == "undefined") req.session.dict = "all";
    if (rating != "") req.session.rating = rating;
    if (checked != "") req.session.checked = checked;
    if (wordtypes != "") req.session.wordtypes = wordtypes;
    if (dict != "")  req.session.dict = dict;

    if (typeof req.session.rowsCount == "undefined") req.session.rowsCount = 100;
    if (typeof req.session.wordtypesfilter == "undefined") req.session.wordtypesfilter = {"where": "", "string":"learning_all"};
    if (typeof req.session.ratingsfilter == "undefined") req.session.ratingsfilter = {"where": "", "string":"learning_all"};
    if (typeof req.session.wordcheckfilter == "undefined") req.session.wordcheckfilter = {"where": "", "string":"learning_all"};
    if (typeof req.session.dictfilter == "undefined") req.session.dictfilter = {"where": "", "string":"learning_all"};

    switch(dict){
        case "common":
            req.session.dictfilter = {"where": " AND dictionary_user_id = '0' ", "string":"filter_common"};
            break;
        case "custom":
            req.session.dictfilter = {"where": " AND dictionary_user_id != '0' ", "string":"filter_custom"};
            break;
        case "all":
            req.session.dictfilter = {"where": "", "string":"learning_all"};
            break;
        case "standart":
            req.session.dictfilter = {"where": ` AND (dictionary_user_id = '0' OR dictionary_user_id = '${SessionController.getUser(req).id}') `, "string":"learning_all"};
            break;
    }

    switch(wordtypes){
        case "verb":
            req.session.wordtypesfilter = {"where": " AND dictionary_word_type = '" + wordtypes + "' ", "string":"learning_verbs"};
            break;
        case "noun":
            req.session.wordtypesfilter = {"where": " AND dictionary_word_type = '" + wordtypes + "' ", "string":"learning_nouns"};
            break;
        case "adj":
            req.session.wordtypesfilter = {"where": " AND dictionary_word_type = '" + wordtypes + "' ", "string":"learning_adj"};
            break;
        case "frss":
            req.session.wordtypesfilter = {"where": " AND dictionary_word_type = '" + wordtypes + "' ", "string":"learning_frases"};
            break;
        case "other":
            req.session.wordtypesfilter = {"where": " AND dictionary_word_type = '" + wordtypes + "' ", "string":"learning_other"};
            break;
        case "all":
            req.session.wordtypesfilter = {"where": "", "string":"learning_all"};
            break;
    }
    switch(rating) {
    	case "not learned":
	    	req.session.ratingsfilter = {"where": " AND raiting_sum = '-1' ", "string":"learning_not_learned"};
	    	break;
        case "0":
            req.session.ratingsfilter = {"where": " AND raiting_sum = '0' ", "string":"learning_bad"};
            break;
    	case "1":
	    	req.session.ratingsfilter = {"where": " AND raiting_sum = '1' ", "string":"learning_normal"};
	    	break;
    	case "2":
	    	req.session.ratingsfilter = {"where": " AND raiting_sum = '2' ", "string":"learning_twice"};
	    	break;
        case "3":
            req.session.ratingsfilter = {"where": " AND raiting_sum = '3' ", "string":"learning_good"};
            break;
        case "4":
            req.session.ratingsfilter = {"where": "  AND raiting_sum = '4' ", "string":"learning_best"};
            break;
	    case "all":
	    	req.session.ratingsfilter = {"where": "", "string":"learning_all"};
	    	break;
    }
    switch (checked) {
    	case "checked":
    		req.session.wordcheckfilter = {"where": " AND raiting_user_check = '1' ", "string":"learning_checked"};
    		break;
    	case "not checked":
    		req.session.wordcheckfilter = {"where": " AND raiting_user_check = '0' ", "string":"learning_not_checked"};
    		break;
    	case "all":
    		req.session.wordcheckfilter = {"where": "", "string":"learning_all"};
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
	var word_translate = req.body.word_translate.replace(/^\s+|\s+$/gm, '');
    var word_lang = req.body.word_lang.replace(/^\s+|\s+$/gm, '');
	var word_tr = req.body.word_tr.replace(/^\s+|\s+$/gm, '');
    var word_type = req.body.word_type.replace(/^\s+|\s+$/gm, '');
    var user_id = SessionController.getUser(req).id;
    if(typeof req.body.word_user_id != "undefined") 
        user_id = req.body.word_user_id;

	if (word_type != "verb") {
		word_inf = "";
    }
    var answer = MySQL.setWordDictionaryTable(word_he, word_inf, word_translate, word_lang, word_tr, word_type, user_id)
    answer.then(result => {
        res.send(result);
        res.end();
    });
}

exports.getFilterFettings = function(req, res) {
	if (typeof req.session.rating == "undefined") req.session.rating = "all";
    if (typeof req.session.checked == "undefined") req.session.checked = "all";
    if (typeof req.session.wordtypes == "undefined") req.session.wordtypes = "all";
    
	res.render('parts/filtersettings.ejs', { check: req.session.wordcheckfilter.string, rating: req.session.ratingsfilter.string, type: req.session.wordtypesfilter.string, dictionary: req.session.dictfilter.string});
    res.end();
}

exports.getTableHead = function(req, res) {
    res.render('parts/gettablehead.ejs', { userid: SessionController.getUser(req).id });
    res.end();
}

exports.renderPlayType = function(req, res) {
    res.render('parts/getcardplaytype.ejs');
    res.end();
}

exports.cardPlayStart = function(req, res) {
    res.render('parts/cardplaystart.ejs');
    res.end();
}

