const { EmbedBuilder } = require("@discordjs/builders");
const db = require("../../db.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        let oldInvites = await db.get(`invites_${member.guild.id}`) || {};

        const currentInvites = await member.guild.invites.fetch();
        const inviteUsed = currentInvites.find((invite) => {
            const previousUses = oldInvites[invite.code] || 0;
            return invite.uses > previousUses;
        });

        if (inviteUsed) {
            oldInvites[inviteUsed.code] = inviteUsed.uses;
            await db.set(`invites_${member.guild.id}`, oldInvites);

            await db.add(`invites_${member.guild.id}_${inviteUsed.inviter.id}`, 1);
            await db.set(`inviter_${member.guild.id}_${member.id}`, inviteUsed.inviter.id);

            const inviteCount = await db.get(`invites_${member.guild.id}_${inviteUsed.inviter.id}`) || 0;

            const c = await db.get(`invites-log-channel`) || null;
            if (c) {
                const c_ = await member.guild.channels.cache.get(c);
                if (!c_) return;

                const embed = new EmbedBuilder()
                    .setTitle("📬 Nouvelle invitation")
                    .setDescription(`${member} a été invité par <@${inviteUsed.inviter.id}> qui a maintenant \`${inviteCount}\` invitations.`);

                try {
                    await c_.send({ embeds: [embed] });
                    
                    // Détécteur de doubles compte
                    const ageInDays = Math.floor((new Date() - interaction.user.createdAt) / (1000 * 60 * 60 * 24));
                    const userAvatar = member.user.avatar !== null;
                    let badges = [];
                        if (user.flags) {
                            if (user.flags.has(1 << 0)) badges.push("Discord Employee");
                            if (user.flags.has(1 << 1)) badges.push("Partnered Server Owner");
                            if (user.flags.has(1 << 2)) badges.push("HypeSquad Events");
                            if (user.flags.has(1 << 3)) badges.push("Bug Hunter Level 1");
                            if (user.flags.has(1 << 6)) badges.push("House Bravery");
                            if (user.flags.has(1 << 7)) badges.push("House Brilliance");
                            if (user.flags.has(1 << 8)) badges.push("House Balance");
                            if (user.flags.has(1 << 9)) badges.push("Early Supporter");
                            if (user.flags.has(1 << 10)) badges.push("Verified Bot");
                            if (user.flags.has(1 << 11)) badges.push("Verified Bot Developer");
                        }
                    if(ageInDays <= 11 || !userAvatar || badges.length < 2) {
                        const embed = new EmbedBuilder()
                    .setTitle("⚠️Suspicion de double comptes ⚠️")
                    .setDescription(`Le membre ${member} est suspecté d'être un double compte.\n\nMerci de rester vigilant et de signaler toute activité suspecte avec la commande /dc-report.`);

                    }

                } catch (error) {
                    console.error("Erreur lors de l'envoi du message : ", error);
                }
            }
        }
    },
};
