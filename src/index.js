const {
  Client, Intents: { FLAGS: Intents }
} = require('discord.js');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { log } = require('./helpers/log');
require('dotenv').config();

const client = new Client({
  intents: [
    Intents.GUILDS, Intents.GUILD_MESSAGES, Intents.GUILD_MESSAGE_REACTIONS,
    Intents.GUILD_VOICE_STATES, Intents.GUILD_MEMBERS
  ]
});

fs.readdir(`${__dirname}/events`, (err, events) => {
  if (err) throw err;

  events.map(event => {
    if (!event.endsWith('.js')) return;
    const eventName = event.replace('.js', '');
    const eventFunc = require(`${__dirname}/events/${event}`);

    client.on(eventName, (...args) => eventFunc(...args, client));
  });
});

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));

const clientId = '855849764997824532';
const guildId = '853738781541924894';

for (const file of commandFiles) {
  const command = require(`${__dirname}/commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    log('info', 'Started refreshing application slash commands...');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

    log('success', 'Successfully reloaded application slash commands!');
  } catch (err) {
    log('error', err);
  }
})();

client.login(process.env.BOT_TOKEN);