const fs = require('fs');

module.exports = (message, client) => {
  const prefix = '.';
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  fs.readdir(`${__dirname}/../commands`, (err, commands) => {
    if (err) console.error(err);

    commands.map(async file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandFile = require(`${__dirname}/../commands/${file}`);
      if (command === commandName) {
        if (!message.member.permissions.has(commandFile.permission)) {
          return await message.reply(`<:NotLikeThis:859024566860120064> **${message.author.username}**, vous n'avez pas la permission d'utiliser cette commande !`)
        }
        
        commandFile.run(message, client, args, true);
      }
    });
  });
}