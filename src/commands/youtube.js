const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ytch = require('yt-channel-info');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Infos sur ma chaîne YouTube'),

  async run(interaction, client, args, isMessage) {
    const channelInfos = await ytch.getChannelInfo({
      channelId: 'UCvXqhbJr7-mr64ZSK8mkB0w'
    }).catch(console.error);

    console.log(channelInfos);

    const embed = new MessageEmbed()
      .setAuthor({
        name: channelInfos.author,
        iconURL: channelInfos.authorThumbnails[2].url,
        url: channelInfos.authorUrl
      })
      .setDescription(channelInfos.description)
      .setURL(channelInfos.authorUrl)
      .addField('Abonnés', `${channelInfos.subscriberCount} abonnés`)
      .setThumbnail(channelInfos.authorBanners[3].url)

    return await interaction.reply({ embeds: [embed] });
  }
};