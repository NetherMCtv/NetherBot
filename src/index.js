const {
  Client, Intents
} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const eventsReadDir = (isWsEvent = false) => {
  const path = isWsEvent ? `${__dirname}/events/ws` : `${__dirname}/events`;
  fs.readdir(path, (err, events) => {
    if (err) console.error(err);

    events.map(event => {
      if (!event.endsWith('.js')) return;
      const eventName = event.replace('.js', '');
      const eventFunc = require(`${path}/${event}`);

      isWsEvent ?
        client.ws.on(eventName, (...args) => eventFunc(...args, client)) :
        client.on(eventName, (...args) => eventFunc(...args, client));
    });
  });
}
// Load events
eventsReadDir();
// Load WS events
eventsReadDir(true);

client.login(process.env.BOT_TOKEN);