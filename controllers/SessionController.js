// var db = require('mysqlController.js');
var isUserSessionExists = function(req) {
    if (typeof req.session.user == "undefined"){
        return false;
    }
    return true;
}
var getUser = function(req){
    if (typeof req.session.user == "undefined") {
        var user = {
            "login" : typeof  req.cookies.login != "undefined" ? req.cookies.login : "guest",
            "id" : typeof  req.cookies.userid != "undefined" ? req.cookies.userid : null,
            "name" : typeof  req.cookies.username != "undefined" ? req.cookies.username : "guest"
        }
        createUserSession(req, user);
    }
    return req.session.user;
}

var createUserSession = function(req, user) {
    req.session.user = user;
    req.session.expires = new Date(2000000000);
}

setUserLang = function (req, res) {
    if(typeof req.body.language == "undefined"){
        if(typeof req.session.language == "undefined")
            req.session.language = typeof req.cookies.language != "undefined" ? req.cookies.language : "en";
            res.cookie('language', req.session.language);
    } else {
        req.session.language = req.body.language;
        res.cookie('language', req.session.language);
    }
}

exports.getUserLang = function (req, res) {
    if(typeof req.session.language == "undefined"){
        setUserLang(req, res);
    }
    return req.session.language;
}

setUserLang = function (req, res) {
    if(typeof req.body.language == "undefined"){
        req.session.language = typeof req.cookies.language != "undefined" ? req.cookies.language : "en";
    } else {
        req.session.language = req.body.language;
        res.cookie('language', req.session.language);
    }
}

exports.getUserLang = function (req, res) {
    if(typeof req.session.language == "undefined"){
        setUserLang(req, res);
    }
    return req.session.language;
}

exports.createUserSession = createUserSession;
exports.setUserLang = setUserLang;
exports.getUser = getUser;
// {

    // "createUserSession" : createUserSession,
    // "isUserSessionExists" : isUserSessionExists,
    // "getUser" : getUser
// };
