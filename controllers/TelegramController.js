const config = require('../config.json');
const MySQLController = require('./MysqlController.js');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(config.TELEGRAM_TOKEN, {polling: true});

bot.on('callback_query', msg => {
    // console.log(JSON.stringify(msg.data));
    var answer = msg.data.toString();
    answer = answer.split(":");
    var wordId = answer[1];
    answer = answer[0].toString();
    if (answer === "accept") {
        MySQLController.approveWord(wordId)
        .then(res => {
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

// bot.onText(/^#(.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message
  
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
  
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
  
//     // send a message to the chat acknowledging receipt of their message
//     bot.sendMessage(chatId, 'Received your message');
// });

bot.on('message', function(message){
    // Received text message
    let reg = new RegExp(/^#(.+)/)
    if(reg.test(message.text))
        console.log(message.text);
    else 
        console.log("wrong");
});

exports.bot = bot;