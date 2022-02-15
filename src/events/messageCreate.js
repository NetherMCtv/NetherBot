const fs = require('fs');

module.exports = async (message, client) => {

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
        if (
          message.channel.id !== '854063459259645962' && // #commandes
          message.channel.id !== '863805344622706709' && // #général-dev
          message.channel.id !== '942391531774562364' && // #tests-netherbot
          !message.author.bot //|| // faut pas que ce soit un bot
          //!message.author.roles.cache.get('863736992106151966') // si c'est pas un développeur
        ) {
          await message.channel.send(
            `Allons ${message.author}, fais-moi plaisir... Va exécuter cette commande dans <#854063459259645962> s'il-te-plait <:UwU:865554940334964757>`
          ).then(m => setTimeout(() => m.delete(), 10000));
          await message.delete();
          return;
        }
        if (!message.member.permissions.has(commandFile.permission)) {
          return await message.reply(`<:NotLikeThis:859024566860120064> **${message.author.username}**, vous n'avez pas la permission d'utiliser cette commande !`)
        }
        
        commandFile.run(message, client, args, true);
      }
    });
  });
}