const ytdl = require('ytdl-core');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel
} = require('@discordjs/voice');
const ms = require('ms');
const { log } = require('../helpers/log');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Mettre de la musique')
    .addStringOption(option => {
      return option
        .setName('url')
        .setDescription('Lien de la vidéo')
        .setRequired(true)
    }),

  async run(interaction, client, args, isMessage) {
    if (isMessage) {
      return interaction.reply('Cette commande ne marche correctement qu\'avec les slash commands à cause de problèmes avec les boutons. Désolé :(');
    }

    const connection = joinVoiceChannel({
      channelId: '865177619321454592',
      guildId: isMessage ? interaction.guild.id : interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });
    const url = isMessage ? args[0] : args[0].value;

    const stream = ytdl(url, {
      filter: 'audioonly',
      lang: 'fr',
      // Source : https://github.com/fent/node-ytdl-core/issues/902#issuecomment-889326785
      highWaterMark: 1 << 25
    });

    stream.on('error', err => {
      log('error', err);
      client.channels.cache.get(interaction.channelId)?.send(err)
    });

    let size;
    stream.on('response', function(res) {
      size = res.headers['content-length'];
      log('info', `Started to load "${videoInfo.videoDetails.title}" with ${size} bytes`);
    });

    let dataEmitted = 0;
    stream.on('data', chunk => dataEmitted += chunk.length);

    const wait = require('util').promisify(setTimeout);
    stream.on('end', async function() {
      log('success', `Finished to load "${videoInfo.videoDetails.title}" with ${dataEmitted} bytes`);

      await wait(15000);
      await interaction.editReply({
        components: [
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle('PRIMARY')
                .setEmoji('⏸')
                .setDisabled(true),
              new MessageButton()
                .setCustomId('stop')
                .setLabel('Stopper')
                .setStyle('DANGER')
                .setEmoji('⏹')
                .setDisabled(true)
            )
        ]
      });
    });

    const videoInfo = await ytdl.getBasicInfo(url);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary
    });
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());

    const filter = i => i.user.id === (isMessage ? interaction.author.id : interaction.member.user.id);

    const collector = (isMessage ? interaction : interaction.channel).createMessageComponentCollector({
      filter, time: ms(videoInfo.videoDetails.lengthSeconds + 's')
    });

    collector.on('collect', async i => {
      if (i.customId === 'pause') {
        player.pause();

        await i.update({
          components: [
            new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('play')
                  .setLabel('Lecture')
                  .setStyle('PRIMARY')
                  .setEmoji('▶'),
                new MessageButton()
                  .setCustomId('stop')
                  .setLabel('Stopper')
                  .setStyle('DANGER')
                  .setEmoji('⏹')
              )
          ]
        });
        return;
      } else if (i.customId === 'play') {
        player.unpause();

        await i.update({
          components: [
            new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('pause')
                  .setLabel('Pause')
                  .setStyle('PRIMARY')
                  .setEmoji('⏸'),
                new MessageButton()
                  .setCustomId('stop')
                  .setLabel('Stopper')
                  .setStyle('DANGER')
                  .setEmoji('⏹')
              )
          ]
        });
        return;
      } else if (i.customId === 'stop') {
        connection.destroy();
        await i.update({
          components: [
            new MessageActionRow()
              .addComponents(
                new MessageButton()
                  .setCustomId('pause')
                  .setLabel('Pause')
                  .setStyle('PRIMARY')
                  .setEmoji('⏸')
                  .setDisabled(true),
                new MessageButton()
                  .setCustomId('stop')
                  .setLabel('Stopper')
                  .setStyle('DANGER')
                  .setEmoji('⏹')
                  .setDisabled(true)
              )
          ]
        });
        return;
      }
    });

    const embed = new MessageEmbed()
      .setAuthor({
        name: videoInfo.videoDetails.author.name,
        iconURL: videoInfo.videoDetails.author.thumbnails[0].url,
        url: videoInfo.videoDetails.author.channel_url
      })
      .setTitle(videoInfo.videoDetails.title)
      .setURL(videoInfo.videoDetails.video_url)
      .setDescription(`La lecture de la musique s'est bien lancée dans <#${connection.joinConfig.channelId}>.`);
    
    await interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId('pause')
              .setLabel('Pause')
              .setStyle('PRIMARY')
              .setEmoji('⏸'),
            new MessageButton()
              .setCustomId('stop')
              .setLabel('Stopper')
              .setStyle('DANGER')
              .setEmoji('⏹')
          )
      ]
    });
    
    if (!isMessage && !interaction.isButton()) return;
  }
}