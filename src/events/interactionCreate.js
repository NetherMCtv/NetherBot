const fs = require('fs');

module.exports = (interaction, client) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName.toLowerCase();
  const args = interaction.options._hoistedOptions;

  fs.readdir(`${__dirname}/../commands`, (err, files) => {
    if (err) console.error(err);

    files.map(async file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandFile = require(`${__dirname}/../commands/${file}`);

      if (command === commandName) {
        if (
          interaction.channelId !== '854063459259645962' && // #commandes
          interaction.channelId !== '863805344622706709' && // #général-dev
          interaction.channelId !== '942391531774562364' && // #tests-netherbot
          !interaction.member.user.bot //|| // faut pas que ce soit un bot
          //!interaction.author.roles.cache.get('863736992106151966') // si c'est pas un développeur
        ) {
          await interaction.reply({
            content: `Allons **${interaction.member.user.username}**, fais-moi plaisir... Va exécuter cette commande dans <#854063459259645962> s'il-te-plait <:UwU:865554940334964757>`,
            ephemeral: true
          })
          return;
        }

        if (!client.application?.owner) await client.application?.fetch();
        if (!interaction.member.permissions.has(commandFile.permission)) {
          return await interaction.reply(`<:NotLikeThis:859024566860120064> **${interaction.member.user.username}**, vous n'avez pas la permission d'utiliser cette commande !`)
        }

        await commandFile.run(interaction, client, args, false);
      }
    });
  });
}