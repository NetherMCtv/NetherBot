const { SlashCommandBuilder } = require('@discordjs/builders');
const { isNegativeNumber } = require('../helpers/numbers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Permet de supprimer beaucoup de messages à la fois')
    .addIntegerOption(option => {
      return option
        .setName('msg_to_delete')
        .setDescription('Nombre de messages à supprimer')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    }),

  permission: 'MANAGE_MESSAGES',

  canBeUsedEverywhere: true,

  async run(interaction, client, args, isMessage) {
    const msgToDelete = parseInt(isMessage ? args[0] : args[0].value);
    const channel = isMessage ? interaction.channel.id : interaction.channelId;

    if (isNegativeNumber(msgToDelete) || msgToDelete === 0) {
      return await interaction.reply('<a:no:859024721282203649> **Le nombre que vous avez donné n\'est pas valide**');
    }

    client.channels.cache.get(channel)?.bulkDelete(msgToDelete);

    const message = `<a:yes:859024680489189388> **${msgToDelete} message${msgToDelete <= 1 ? '' : 's'} ont été supprimés.**`;
    await isMessage ?
      interaction.channel.send(message).then(m => setTimeout(() => m.delete(), 10000)) :
      interaction.reply({content: message, ephemeral: true });
  }
}