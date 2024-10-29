const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const config = require("../../../config");
const db = require("../../../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invites-log-channel")
    .setDescription("Configure les logs invites sur le serveur")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  category: "Utility",

  async execute(interaction, client) {
    let selectedChannelId;
    const c = await db.get(`invites-log-channel`) || null;
    if (c) {
      selectedChannelId = c;
    }

    const channels = interaction.guild.channels.cache
      .filter(channel => channel.type === ChannelType.GuildText)
      .map(channel => ({
        label: channel.name,
        value: channel.id,
      }));

    const embed = new EmbedBuilder()
      .setTitle("📩 Configuration du système d'invitation")
      .setDescription(`Grâce à la sélection ci-dessous, vous allez pouvoir configurer au mieux le bot.\nLog channel : ${c ? `<#${c}>` : "Aucun salon sélectionné"}`)
      .setColor("#FFA500");

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("invites-log-channel-select")
      .setPlaceholder("Sélectionnez un salon pour les logs d'invites")
      .addOptions(channels);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (selectInteraction) => {
      if (selectInteraction.user.id !== interaction.user.id) {
        return selectInteraction.reply({
          content: ":x: Vous ne pouvez pas interagir avec cette sélection.",
          ephemeral: true,
        });
      }

      if (selectInteraction.customId === "invites-log-channel-select") {
        selectedChannelId = selectInteraction.values[0];
        
        await selectInteraction.deferUpdate();
        await selectInteraction.followUp({
          content: `Salon choisi : <#${selectedChannelId}>. Les modifications ont été enregistrées.`,
          ephemeral: true,
        });

        await db.set(`invites-log-channel`, selectedChannelId);
      }
    });

    collector.on('end', () => {
      interaction.editReply({
        components: [
          new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId("invites-log-channel-select")
              .setPlaceholder("Sélectionnez un salon pour les logs d'invites")
              .setDisabled(true)
              .addOptions(channels)
          ),
        ]
      });
    });
  },
};
