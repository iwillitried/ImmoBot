const ImmoCrawler = require('./Immocrawler');
const { Telegraf } = require('telegraf');
process.env.API_TOKEN = "1773464054:AAHQlAofGmk5BEmTeNr2aK4Ig2LTy70qlyg"
const express = require('express')
const expressApp = express()
const port = process.env.PORT || 3000

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
const bot = new Telegraf(process.env.API_TOKEN)


/**
 * Using: 
 * Telegram Framework: https://www.section.io/engineering-education/telegram-bot-in-nodejs/
 * Webcrawler: https://www.npmjs.com/package/node-webcrawler
 * Serverside jQuery: https://cheerio.js.org/interfaces/cheerioapi.html
 */
var state = undefined;
var clients = {}
bot.command('start', ctx => {
    clients[ctx.chat.id] = {};
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Welcome! \nGive me an ImmoScout search link and I will send you new results as soon as they get available 🏠 🔍');
});

bot.hears(/./, (ctx) => {
    let message = ctx.update.message.text;
    client = {}; 
    client.url = message;
    client.crawler = new ImmoCrawler(message); 
    clients[ctx.chat.id] = client; 
    ctx.reply(`Looking for new results on: ${ctx.update.message.text}`); 
});

bot.startPolling()

function fetchResults() {
    //console.log("Fetching: ", clients);
    for (chatID in clients) {
        client = clients[chatID]; 
        //console.log("This is client: ", client);
        if (!(client && client.crawler && client.url)) continue;
        //console.log("Client: ", client.url);
        client.crawler.fetch();
        let resultIDs = client.crawler.getResults();
        if (resultIDs != {}) sendResults(chatID, resultIDs); 
    }
}

function sendResults(chatID, resultIDs) {
    for (resultID in resultIDs) {
        bot.telegram.sendMessage(chatID, "https://www.immobilienscout24.de/expose/" + resultID); 
    }
}

setInterval(fetchResults, 60 * 1000) 