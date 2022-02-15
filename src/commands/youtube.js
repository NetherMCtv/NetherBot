const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ytch = require('yt-channel-info');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('youtube')
    .setDescription('Infos sur ma chaîne YouTube')
    .addStringOption(option => {
      return option
        .setName('chaine')
        .setDescription('La chaine dont vous désirez voir les infos')
        .addChoice('Principale', 'default')
        //.addChoice('Shorts et Clips', 'shortsclips')
        .addChoice('Nini 1er (voir la vidéo du 12 fév. 2022)', 'nini1er')
    })
  ,

  async run(interaction, client, args, isMessage) {
    const channelInfos = async (channel) => {
      let channelId;
      if (channel === 'default') {
        channelId = 'UCvXqhbJr7-mr64ZSK8mkB0w';
      } else if (channel === 'shortsclips') {
        channelId = 'UCHK3N27V6yzJ2l7isgGltag';
      } else if (channel === 'nini1er') {
        channelId = 'UC3Rvmwts720qiru2ObCDoYA';
      }

      return await ytch.getChannelInfo({ channelId }).catch(console.error);
    }

    const channel = await channelInfos(args[0]?.value || 'default');

    const embed = new MessageEmbed()
      .setAuthor({
        name: channel.author,
        iconURL: channel.authorThumbnails && channel.authorThumbnails[2].url,
        url: channel.authorUrl
      })
      .setDescription(channel.description)
      .setURL(channel.authorUrl)
      .addField('Abonnés', `${channel.subscriberCount} abonnés • [S'abonner](${channel.authorUrl}?sub_confirmation=1)`, true)
      .addField('Tags', channel.tags ? channel.tags.join(', ') : 'Aucun', true)
      .setThumbnail(channel.authorBanners && channel.authorBanners[3].url)

    return await interaction.reply({ embeds: [embed] });
  }
};