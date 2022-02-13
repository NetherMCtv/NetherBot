const {
  Client, Intents
} = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

fs.readdir(`${__dirname}/events`, (err, events) => {
  if (err) {
    console.error(err);
  }

  events.map(event => {
    if (!event.endsWith('.js')) return;
    const eventName = event.replace('.js', '');
    const eventFunc = require(`${__dirname}/events/${event}`);

    client.on(eventName, (...args) => eventFunc(...args, client));
  });
});

client.login(process.env.BOT_TOKEN);