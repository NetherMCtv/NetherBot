const fs = require('fs');

module.exports = (message, client) => {
  const prefix = '.';
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

  fs.readdir(`${__dirname}/../commands`, (err, commands) => {
    if (err) console.error(err);

    commands.map(file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandFunc = require(`${__dirname}/../commands/${file}`);
      if (command === commandName) {
        commandFunc.run(message, client, args, true);
      }
    });
  });
}