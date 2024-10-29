const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
const config = require("../config");
const { Collection } = require("discord.js");
module.exports = (client) => {
client.messageCommands = async () => {
  const commandFolders = readdirSync("./Commands/Message");
  for (const folder of commandFolders) {
    const commandFiles = readdirSync(`./Commands/Message/${folder}`).filter(
      (file) => file.endsWith(".js")
    );

    for (const file of commandFiles) {
      const command = require(`../Commands/Message/${folder}/${file}`);

      client.messageCmd.set(command.name, command);

      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach(alias => {
          client.messageCmd.set(alias, command);
        });
      }

      delete require.cache[
        require.resolve(`../Commands/Message/${folder}/${file}`)
      ];
    }
  }
};
}

