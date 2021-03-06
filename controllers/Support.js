var config = require('../config.json');

// const TelegramBot = require("node-telegram-bot-api");
// const bot = new TelegramBot(config.TELEGRAM_TOKEN, {polling: true});
// exports.bot = bot;
/*bot.on('message', function(msg){
    console.log(JSON.strigify(msg));
});*/

// bot.on('callback_query', function(msg){
//     console.log(JSON.stringify(msg));
//     bot.answerCallbackQuery(msg.id, "You hit button!", false);
// });

exports.getCurrDateFormatted = function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    var day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
}
exports.getCurrentTimeFormatted = function () {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return `${hour}:${minute}:${second}`;
}
/**
 *
 * adds current date to the end of the stringified array of dates;
 * if length of array more than MAX_ARR_CAPACITY, removes first
 * array date-element;
 * @param dates
 * @return strigified array of dates with max length == MAX_ARR_CAPACITY
 */
exports.addCurrentDate = function (dates) {
    // console.log(typeof dates);
    const MAX_ARR_CAPACITY = 7;
    var currentDate = new Date();
    if (dates.length > MAX_ARR_CAPACITY) {
        dates.shift();
    }
    dates.push(currentDate);
    return dates;
};
/**
 * Evaluates data of hits and misses array into number of rating of word;
 * @param hits - array of JS Data objects of last hits of word;
 * @param misses - array of JS Data objects of last misses of word;
 * @returns number of word rating;
 */
exports.getRating = function (hits, misses) {
    var rating;
    //TODO сделать нормальный подсчёт рейтинга
    rating = hits.length - misses.length;
    return rating;
};

exports.getUserLangStrings = function(JSONArrayAll, userLang){
    var JSONArrayCurLang = "{";
    var l = JSONArrayAll.length;
    for(var i = 0; i < l; i++){
        var coma = "";
        if(i < l-1) coma = ",";
        JSONArrayCurLang+=`"${JSONArrayAll[i].id}": "${JSONArrayAll[i][userLang]}"${coma}`;
    }
    JSONArrayCurLang+="}";
    JSONArrayCurLang = JSON.parse(JSONArrayCurLang);
    return JSONArrayCurLang;
};

exports.sendEmail = function(res, emailAdr, sbj, txt) {
  var email = require('nodemailer');
  var transporter = email.createTransport({
  service: 'gmail',
  auth: {
    user: res.locals.config.email,
    pass: res.locals.config.emailPass
  }
  });
  var mailOptions = {
    from: res.locals.config.email,
    to: emailAdr,
    subject: sbj,
    html: txt
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

exports.generateRamdomCharacters = function(count=1){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
