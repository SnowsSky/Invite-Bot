const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const config = require("../../../config");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get API latency")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null),
  category: "Utility",

  async execute(interaction, client) {
    await interaction.reply({ content: "Calculating ping..." }).then(resultMessage => {
      const ping = resultMessage.createdTimestamp - interaction.createdTimestamp;
      const apiping = client.ws.ping;

      const exampleEmbed = new EmbedBuilder()
        .setColor(config.color)
        .setDescription(`> 🏓Pong : **${apiping}**ms`)
        .setTimestamp();

      resultMessage.edit({ content: "", embeds: [exampleEmbed] });
    });
  },
};
