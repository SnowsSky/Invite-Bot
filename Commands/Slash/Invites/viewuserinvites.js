const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  const config = require("../../../config");
  const db = require("../../../db.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("user-invites")
      .setDescription("Voir le nombre d'invitation(s) d'un membre")
      .addUserOption(option =>
        option.setName("utilisateur")
          .setDescription("L'utilisateur dont vous voulez voir les invitations")
          .setRequired(false)
      )
      .setDMPermission(false)
      .setDefaultMemberPermissions(null),
    category: "Utility",
  
    async execute(interaction, client) {
      const user = interaction.options.getUser("utilisateur") || interaction.user;
      const guildId = interaction.guild.id;
  
      const invites = await db.get(`invites_${guildId}_${user.id}`) || 0;
      const leaves = await db.get(`leaves_${guildId}_${user.id}`) || 0;
  
      const embed = new EmbedBuilder()
        .setTitle(`Invitations de ${user.username}`)
        .setDescription(`${user} a fait \`${invites} invitation(s)\` dont \`${leaves} qui ont quittés le serveur\``)

        .setColor(config.color)
        .setTimestamp();
  
      await interaction.reply({ embeds: [embed] });
      const ageInDays = Math.floor((new Date() - interaction.user.createdAt) / (1000 * 60 * 60 * 24));
      console.log(ageInDays)
    },
  };
  