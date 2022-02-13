const fs = require('fs');

module.exports = (message, client) => {
  fs.readdir(`${__dirname}/commands`, (err, commands) => {
    if (err) {
      console.error(err);
    }

    commands.map(command => {
      if (!command.endsWith('.js')) return;
      const commandName = command.replace('.js', '');
      const commandFunc = require(`${__dirname}/commands/${command}`);

      if (message.content.startsWith('.' + commandName)) {
        commandFunc(message, client);
      }
    });
  });
}