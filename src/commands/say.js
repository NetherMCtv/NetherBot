const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Util } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faire parler le bot (●\'◡\'●)')
    .addStringOption(option => {
      return option
        .setName('à_dire')
        .setDescription('Ce que vous avez à dire')
        .setRequired(true)
      ;
    }),

  canBeUsedEverywhere: true,

  async run(interaction, client, args, isMessage) {
    const aDire = isMessage ? args.join(' ') : args[0].value;
    const embed = new MessageEmbed()
      .setDescription(Util.escapeMarkdown(aDire))
      .setFooter({
        text: 'Envoyé par ' + (isMessage ? interaction.author.tag : interaction.member.user.tag),
        iconURL: isMessage ? interaction.author.avatarURL() : interaction.member.user.avatarURL()
      });

    return await interaction.reply({ embeds: [embed] });
  }
}