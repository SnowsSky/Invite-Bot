const db = require("../../db.js");
const { EmbedBuilder } = require("discord.js")
module.exports = {
    name: "guildMemberRemove",
    async execute(member, client) {
        const inviterId = await db.get(`inviter_${member.guild.id}_${member.id}`);
        if (inviterId) {
            let currentInvites = await db.get(`invites_${member.guild.id}_${inviterId}`) || 0;

            if (currentInvites > 0) {
                currentInvites -= 1;
                await db.set(`invites_${member.guild.id}_${inviterId}`, currentInvites);
            }
            
            await db.delete(`inviter_${member.guild.id}_${member.id}`);

            const leaves = await db.get(`leaves_${member.guild.id}_${inviterId}`) || 0;
            await db.set(`leaves_${member.guild.id}_${inviterId}`, leaves + 1);

            const c = await db.get(`invites-log-channel`) || null;
            if (c) {
                const c_ = await member.guild.channels.cache.get(c);
                if (!c_) return;


                const embed = new EmbedBuilder()
                    .setTitle("📭 Départ d'un membre")
                    .setDescription(`${member} a quitté le serveur qui avait été invité par <@${inviterId}> a maintenant \`${currentInvites}\` invitations.`);

                try {
                    await c_.send({ embeds: [embed] });
                } catch (error) {
                    console.error("Erreur lors de l'envoi du message : ", error);
                }
            }

            

        } else {
            console.log(`Aucun invité trouvé pour ${member.user.tag}`);
        }
    },
};
