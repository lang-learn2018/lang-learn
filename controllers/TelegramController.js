const config = require('../config.json');
const MySQLController = require('./MySQLController.js');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(config.TELEGRAM_TOKEN, {polling: true});

bot.on('callback_query', msg => {
    // console.log(JSON.stringify(msg.data));
    var answer = msg.data.toString();
    console.log(answer);
    answer = answer.split(":");
    console.log(answer);
    var wordId = answer[1];
    answer = answer[0].toString();
    if (answer === "accept") {
        MySQLController.approveWord(wordId)
        .then(res => {
            console.log(res);
            if(res){
                bot.answerCallbackQuery(msg.id, "Word approved!", false);
            } else {
                bot.answerCallbackQuery(msg.id, "Error!", false);
            }
        });
    } else {
        MySQLController.removeWord(wordId)
        .then(res => {
            if (res) {
                bot.answerCallbackQuery(msg.id, "Word successefuly removed!", false);
            } else {
                bot.answerCallbackQuery(msg.id, "Error!", false);
            }
        });
    }
});



exports.bot = bot;