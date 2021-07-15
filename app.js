
const { Telegraf } = require('telegraf');
const ImmoCrawler = require('./Immocrawler');
BOT_TOKEN = "1773464054:AAHQlAofGmk5BEmTeNr2aK4Ig2LTy70qlyg"
const bot = new Telegraf(BOT_TOKEN)
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://git.heroku.com/berlin-immo-bot.git';


/**
 * Using: 
 * Telegram Framework: https://www.section.io/engineering-education/telegram-bot-in-nodejs/
 * Webcrawler: https://www.npmjs.com/package/node-webcrawler
 * Serverside jQuery: https://cheerio.js.org/interfaces/cheerioapi.html
 */
var state = undefined;
var clients = {}
console.log( ImmoCrawler );
bot.command('start', ctx => {
    clients[ctx.chat.id] = {};
    console.log(ctx.from);
    bot.telegram.sendMessage(ctx.chat.id, 'Welcome! \nGive me an ImmoScout search link and I will send you new results as soon as they get available 🏠 🔍');
});

bot.on('text', (ctx) => {
    let message = ctx.update.message.text;
    client = {}; 
    client.url = message;
    client.crawler = new ImmoCrawler(message); 
    clients[ctx.chat.id] = client; 
    ctx.reply(`Looking for new results on: ${ctx.update.message.text}`); 
});

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

bot.telegram.setWebhook(`${URL}/bot${BOT_TOKEN}`);
bot.startWebhook(`/bot${BOT_TOKEN}`, null, PORT)
console.log("Launched Telegram bot on port ", PORT, " Adress: ", `${URL}/bot${BOT_TOKEN}`);
setInterval(fetchResults, 120000); // Start fetch every two minutes

