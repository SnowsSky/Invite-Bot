const { ActivityType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ready",
  async execute(client, guild) {
    console.log(`Connecté à ${client.user.username}`);
    console.log(`Je suis sur ${client.guilds.cache.size} serveurs`);
    client.messageCommands();
    client.slashCommands();
   

    await client.user.setActivity(`${client.guilds.cache.size} Servers`, {
      type: ActivityType.Idle,
    });


 
  },
};
