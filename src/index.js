const {
  Client
} = require('discord.js');
require('dotenv').config();

const client = new Client();

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);