const fs = require('fs');
const axios = require('axios');

module.exports = (interaction, client) => {
  const command = interaction.data.name.toLowerCase();
  const args = interaction.data.options;

  fs.readdir(`${__dirname}/../../commands`, (error, files) => {
    if (error) throw error;

    files.map(file => {
      if (!file.endsWith('.js')) return;
      const commandName = file.replace('.js', '');
      const commandClass = require(`${__dirname}/../../commands/${file}`);

      const guildId = interaction.guild_id;
      const clientId = client.user.id;

      client.api.applications(clientId).guilds(guildId).commands.post({
        data: commandClass.getHelp()
      });

      if (command === commandName) {
        const config = body => {
          return {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bot ${process.env.BOT_TOKEN}`
            },
            body: JSON.stringify(body)
          };
        };
        const ownerPermission = axios.get(
          `https://discord.com/api/v9/applications/${clientId}/guilds/${guildId}/commands/${interaction.data.id}/permissions`,
          config({
            permissions: [
              {
                type: 2,
                id: '807326854314590228',
                permission: true
              }
            ]
          })
        );
        Promise.all([ownerPermission]).catch(console.error);

        if (commandClass.getPermission()) {
          const permissions = axios(
            `https://discord.com/api/v9/applications/${clientId}/guilds/${guildId}/commands/${interaction.data.id}/permissions`,
            config({
              permissions: commandClass.getPermission()
            })
          );
          Promise.all([permissions, ownerPermission]).catch(console.error);
        }

        const data = (new commandClass).run(interaction, client, args, false);
        client.api.interactions(interaction.data.id, interaction.token).callback.post({ data: { type: 4, data } });
      }
    });
  });
}