const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

// Map pour stocker les intervalles actifs par guild
const activeIntervals = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('imminent')
        .setDescription('Commence ou arrête une méditation intensive sur l\'imminence d\'une session')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Débute une méditation intensive'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Arrête la méditation intensive')),

    async execute(interaction) {
        try {
            // Vérifier si l'utilisateur est un joueur autorisé
            if (!config.playerIds.includes(interaction.user.id)) {
                await interaction.reply({
                    content: '*Médite sur l\'audace de l\'intrus*\nSeuls les disciples peuvent initier une méditation intensive...',
                    ephemeral: true
                });
                return;
            }

            const subcommand = interaction.options.getSubcommand();
            const guildId = interaction.guildId;

            if (subcommand === 'start') {
                await this.startImminent(interaction, guildId);
            } else if (subcommand === 'stop') {
                await this.stopImminent(interaction, guildId);
            }
        } catch (error) {
            console.error('Erreur dans la commande imminent:', error);
            await interaction.reply({
                content: '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...',
                ephemeral: true
            });
        }
    },

    async startImminent(interaction, guildId) {
        // Vérifier si déjà actif
        if (activeIntervals.has(guildId)) {
            await interaction.reply({
                content: config.messages.imminentAlreadyActive,
                ephemeral: true
            });
            return;
        }

        const targetUser = await interaction.client.users.fetch(config.targetUserId);
        if (!targetUser) {
            throw new Error('MJ introuvable');
        }

        // Fonction d'envoi de message
        const sendMessage = async () => {
            try {
                const { message, gif } = config.getRandomImminentMessage();
                await targetUser.send(`${message}\n${gif}`);
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message imminent:', error);
                // Arrêter l'intervalle en cas d'erreur
                this.stopImminent(interaction, guildId, true);
            }
        };

        // Créer l'intervalle
        const interval = setInterval(sendMessage, 5 * 60 * 1000); // 5 minutes
        activeIntervals.set(guildId, interval);

        // Envoyer le premier message immédiatement
        await sendMessage();

        // Confirmer le démarrage
        await interaction.reply({
            content: config.messages.imminentStart,
            ephemeral: true
        });
    },

    async stopImminent(interaction, guildId, isError = false) {
        // Vérifier si actif
        if (!activeIntervals.has(guildId)) {
            if (!isError) {
                await interaction.reply({
                    content: config.messages.imminentNotActive,
                    ephemeral: true
                });
            }
            return;
        }

        // Arrêter l'intervalle
        clearInterval(activeIntervals.get(guildId));
        activeIntervals.delete(guildId);

        // Confirmer l'arrêt
        if (!isError) {
            await interaction.reply({
                content: config.messages.imminentStop,
                ephemeral: true
            });
        }
    }
};