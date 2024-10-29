const { readdirSync } = require("fs");
const { REST, Routes } = require("discord.js");
module.exports = (client) => {
  let = slashCommandArray = [];

  client.slashCommands = async () => {
    const commandFolders = readdirSync("./Commands/Slash");
    for (const folder of commandFolders) {
      const commandFiles = readdirSync(`./Commands/Slash/${folder}`).filter(
        (file) => file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const command = require(`../Commands/Slash/${folder}/${file}`);
        if (!command.maintenance) {
          await slashCommandArray.push(command.data.toJSON());
		  
          const properties = {folder, ...command}  
          await client.slashCmd.set(command.data.name, properties);
        }
      }
    }


    const rest = new REST({ version: "10" }).setToken(client.token);

    (async () => {
      try {


        await rest.put(Routes.applicationCommands(client.user.id), {
          body: slashCommandArray,
        });

        console.log(`${slashCommandArray.length} Commande(s) Slash chargée`);
      } catch (error) {
        console.error(error);
      }
    })();
  };
};
