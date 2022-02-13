module.exports = class Command {
  constructor() {
    this.help = {};
    this.permission = null;
  }

  static getHelp() {
    return (new this).help;
  }
  setHelp(help) {
    this.help = help;
  }

  static getPermission() {
    return (new this).permission;
  }
  setPermission(permission) {
    this.permission = permission;
  }

  run(message, client, args) {}

  returnContent(content, embeds, components) {
    return {
      content, embeds, components
    };
  }

  returnContentMessage(message, content, embeds, components) {
    return message.channel.send({content, embeds, components});
  }
}