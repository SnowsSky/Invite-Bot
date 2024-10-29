const { InteractionType } = require("discord.js");
const { Collection } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type === InteractionType.ApplicationCommand) {

      const cmd = client.slashCmd.get(interaction.commandName);
      if (!cmd) return;

      const { cooldowns } = client;

      if (!cooldowns.has(cmd.data.name)) {
        cooldowns.set(cmd.data.name, new Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(cmd.data.name);
      const defaultCooldownDuration = 6;
      const cooldownAmount = (cmd.cooldown ?? defaultCooldownDuration) * 1000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
      
        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1000);
          return interaction.reply({ content: `Please retry \`${cmd.data.name}\` <t:${expiredTimestamp}:R>.`, ephemeral: true });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);




      await cmd.execute(interaction, client);
    }
  },
};
