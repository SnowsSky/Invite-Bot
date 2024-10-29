const config = require("../../config");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    
    
	
    if (message.author.bot) return;
      if(message.channel.id === "1116013005025583145") message.delete()
    if (message.content == `<@${client.user.id}>`) {
      message.reply(
        `Hey, je suis ${client.user.username}, Je suis un bot Seulement en commands slash ! tape /help ;)`
      );
    }

    if (message.content.toLowerCase().startsWith(config.prefix)) {
      if (!message.author.id === "848592502214885416") return;
      const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
      
      let cmd = await client.messageCmd.get(args[0]);
      if (!cmd) return;
      return await cmd.execute(message, client, args);
    }
  },
};
