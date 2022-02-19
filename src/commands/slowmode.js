const { SlashCommandBuilder } = require('@discordjs/builders');
const { isNegativeNumber } = require('../helpers/numbers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Définir le temps du mode lent')
    .addIntegerOption(option => {
      return option
        .setName('secondes')
        .setDescription('Temps du mode lent (0 pour désactiver)')
        .setMinValue(1)
        .setRequired(true);
    }),

  permission: 'MANAGE_CHANNELS',

  async run(interaction, client, args, isMessage) {
    const channel = isMessage ? interaction.channel.id : interaction.channelId;
    const rateLimit = parseInt(isMessage ? args[0] : args[0].value);

    if (isNegativeNumber(rateLimit)) {
      return await interaction.reply('<a:no:859024721282203649> **Le nombre que vous avez donné n\'est pas valide**');
    }
    client.channels.cache.get(channel)?.setRateLimitPerUser(rateLimit);

    if (rateLimit === 0) {
      return await interaction.reply('<a:yes:859024680489189388> **Le mode lent a bien été désactivé**');
    }
    return await interaction.reply(`<a:yes:859024680489189388> **Le mode lent a été bien défini à ${rateLimit} seconde${rateLimit <= 1 ? '' : 's'}**`);
  }
};