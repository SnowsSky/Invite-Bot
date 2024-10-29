const {
  ComponentType,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const config = require("../../../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Help command")
    .setDMPermission(false)
    .setDefaultMemberPermissions(null),
  category: "Utility",

  async execute(interaction, client) {
    const emojis = {
      Info: "❓",
      Invites: "👋",
    };

    const directories = [
      ...new Set(interaction.client.slashCmd.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = directories.map((dir) => {
      const getCommands = interaction.client.slashCmd
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description: cmd.data.description || "No description",
          };
        });

      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    const embed = new EmbedBuilder()
      .setDescription(`Slt`)
      .setColor(config.color);

      const components = (state) => [
        new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("Menu-help")
            .setPlaceholder("Please choose a category below")
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                const emoji = emojis[cmd.directory] || undefined;
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  description: `Command from ${cmd.directory}`,
                  emoji: emoji ? { name: emoji } : undefined,
                };
              })
            )
        ),
      ];
      

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (i) =>
      i.user.id === interaction.user.id && i.customId === "Menu-help";

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 60000,
    });

    collector.on("collect", (i) => {
      try {
        const [directory] = i.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle(`${formatString(directory)} commands`)
          .setDescription(`The list of categorized commands for ${directory}`)
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `\`${cmd.name}\``,
                value: cmd.description,
                inline: true,
              };
            })
          );

        i.update({ embeds: [categoryEmbed] });
      } catch (e) {
        console.error(e);
        return i.reply({
          content: "An error occurred while processing your selection.",
          ephemeral: true,
        });
      }
    });

    collector.on("end", () => {
      initialMessage.edit({ components: components(true) }).catch(() => {});
    });
  },
};
