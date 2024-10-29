const { readdirSync } = require("fs");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
module.exports = (client) => {
  let eventArray = [];
  client.handleEvents = async () => {
    const eventFolders = readdirSync(`./Events`);
    for (const folder of eventFolders) {
      const eventFiles = readdirSync(`./Events/${folder}`).filter((file) =>
        file.endsWith(".js")
      );
      for (const file of eventFiles) {
        const event = require(`../Events/${folder}/${file}`);
        const execute = (...args) => event.execute(...args, client);
        eventArray.push(execute);
        if (event.once) client.once(event.name, execute);
        else client.on(event.name, execute);
        client.events.set(event.name, execute);
      }
    }

    console.log(`${eventArray.length} Client Event(s) chargée`);
  };
};
