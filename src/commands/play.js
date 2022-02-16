const ytdl = require('ytdl-core');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	AudioPlayerStatus, StreamType, createAudioPlayer, createAudioResource, joinVoiceChannel
} = require('@discordjs/voice');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Mettre de la musique')
    .addStringOption(option => {
      return option
        .setName('url')
        .setDescription('Lien de la vidéo')
        .setRequired(true)
    })
  ,

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
      lang: 'fr'
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
        await i.reply({ content: 'La musique a bien été arrêtée', ephemeral: true });
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
    console.log(interaction);
  },

  /**
   * @param {string} url
   */
   async getAudioSource(url) {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return await ytdl(url, {
        filter: 'audioonly'
      });
    }

    // SoundCloud
    //else if (url.includes('soundcloud.com')) {}

    // Spotify
    //else if (url.includes('spotify.com')) {}

    // Aucune source
    else {
      console.error(`"${url}" is not an audio on YouTube, SoundCloud or Spotify`);
    }
  }
}