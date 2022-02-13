const Command = require('../helpers/Command');

module.exports = class SlowModeCommand extends Command {
  constructor() {
    super();

    this.setHelp({
      name: 'slowmode',
      description: 'Définir le temps du mode lent',
      default_permission: false,
      options: [
        {
          type: 4,
          name: 'secondes',
          description: 'Temps du mode lent (0 pour désactiver)',
          required: true
        }
      ]
    });
    this.setPermission([
      {
        type: 1,
        id: '855852738544926771',
        permission: true
      }
    ]);
  }

  run(interaction, client, args, isMessage) {
    const channel = isMessage ? interaction.channel.id : interaction.channel_id;
    const rateLimit = parseInt(isMessage ? args[0] : args[0].value);
    if (Math.sign(rateLimit) === -1 || isNaN(Math.sign(rateLimit))) {
      return this.returnContentMessage(interaction, '<a:no:859024721282203649> **Le nombre que vous avez donné n\'est pas valide**');
    }
    client.channels.cache.get(channel)?.setRateLimitPerUser(rateLimit);

    if (rateLimit === 0) {
      return this.returnContentMessage(interaction, '<a:yes:859024680489189388> **Le mode lent a bien été désactivé**');
    }
    return this.returnContentMessage(
      interaction,
      `<a:yes:859024680489189388> **Le mode lent a été bien défini à ${rateLimit} seconde${rateLimit <= 1 ? '' : 's'}**`
    );
  }

}