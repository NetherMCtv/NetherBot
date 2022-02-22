const { MessageAttachment, MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const { applyText } = require('../helpers/image');

const attachment = async (member) => {
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage(`${__dirname}/../../assets/images/welcome_background.png`);

  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  // "Bienvenue"
  context.font = '40px "Ubuntu"';
  context.fillStyle = '#ffffff';
  context.fillText('Bienvenue à', canvas.width / 2.75, canvas.height / 2.9);

  // nom de l'user
  context.font = applyText(canvas, member.user.username, '"Ubuntu"');
  context.fillStyle = '#ffffff';
  context.fillText(member.user.username, (canvas.width / 2.75) - 1.5, canvas.height / 1.7);

  // "sur le serveur"
  context.font = '40px "Ubuntu"';
  context.fillStyle = '#ffffff';
  context.fillText('sur mon serveur !', canvas.width / 2.75, canvas.height / 1.3);

  // Rends l'image ronde
  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  context.drawImage(avatar, 25, 25, 200, 200);

  return new MessageAttachment(canvas.toBuffer(), 'welcome.png');
}

module.exports = async (member, client) => {
  if (member.user.bot) return;

  const embed = new MessageEmbed()
    .setTitle('Un nouveau membre <:heart:859720639529877506> !')
    .setDescription(`Tu es le **${member.guild.memberCount}ème membre** !`)
    .setImage('attachment://' + await (await attachment(member)).name)
    .setFooter({ text: 'À rejoint le serveur' })
    .setTimestamp(member.joinedTimestamp)

  client.channels.cache.get('862308107250040852')?.send({ embeds: [embed], files: [await attachment(member)] });
}