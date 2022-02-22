const { log } = require('../helpers/log');
const chalk = require('chalk');

module.exports = (client) => {
  log('info', `Connecté en tant que ${chalk.bold(client.user.tag)}.`);

  const statuses = [
    ['sur Twitch', 'STREAMING'],
    ['une vidéo de NetherMC', 'WATCHING'],
    ['Minecraft', 'PLAYING']
  ];
  
  let i = 0;
  setInterval(async () => {
    await client.user.setActivity(statuses[i][0], {
      type: statuses[i][1],
      url: 'https://www.twitch.tv/NetherMCtv'
    });
    i = ++i % statuses.length;
  }, 8e3);
};