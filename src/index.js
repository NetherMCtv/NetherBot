const {
  Client, Intents
} = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);