const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roast')
        .setDescription('Je serais ravi d\'envoyer une pique à notre pas si vénérable que ça MJ'),

    async execute(interaction) {
        try {
            const guild = interaction.client.guilds.cache.get(config.guildId);
            if (!guild) {
                throw new Error('Guild non trouvée');
            }

            const notificationChannel = await guild.channels.fetch(config.notificationChannelId);
            if (!notificationChannel) {
                throw new Error('Canal de notification non trouvé');
            }

            // Si c'est le MJ qui utilise la commande
            if (interaction.user.id === config.targetUserId) {
                const response = config.getRandomMJSelfRoast();
                await interaction.reply({
                    content: response,
                    ephemeral: true
                });
                return;
            }

            // Vérifier si l'utilisateur est un joueur autorisé
            if (!config.playerIds.includes(interaction.user.id)) {
                await interaction.reply({
                    content: '*Médite sur l\'audace de l\'intrus*\nSeuls les disciples peuvent critiquer leur maître...',
                    ephemeral: true
                });
                return;
            }

            // Récupérer et formater un roast aléatoire
            let roast = config.getRandomRoast().replace(/<@TARGET_USER_ID>/g, `<@${config.targetUserId}>`);

            // Indiquer à l'utilisateur que le message a été envoyé
            await interaction.reply({
                content: '*S\'incline avec élégance*\nVotre méditation sarcastique a été transmise au canal approprié...',
                ephemeral: true
            });

            // Envoyer le roast dans le canal de notification
            await notificationChannel.send({
                content: roast,
                allowedMentions: { users: [config.targetUserId] }
            });

        } catch (error) {
            console.error('Erreur dans la commande roast:', error);
            await interaction.reply({
                content: '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...',
                ephemeral: true
            });
        }
    }
};