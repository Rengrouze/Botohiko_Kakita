const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session')
        .setDescription('Propose une session pour un jour spécifique')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Date de la session (JJ/MM/YYYY)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('heure')
                .setDescription('Heure de la session (HH:MM)')
                .setRequired(true)),

    async execute(interaction) {
        try {
            if (interaction.user.id !== config.targetUserId) {
                await interaction.reply({
                    content: '*Médite sur l\'audace de l\'impudent*\nSeul notre vénérable Maître de Jeu peut planifier les sessions...',
                    ephemeral: true
                });
                return;
            }

            const { valid, sessionDate } = await this.validateDateTime(interaction);
            if (!valid) return;

            await interaction.client.reminderService.sessionManager.scheduleFutureSession(
                interaction,
                sessionDate
            );
        } catch (error) {
            console.error('Erreur dans la commande session:', error);
            await interaction.reply({
                content: '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...',
                ephemeral: true
            });
        }
    },

    async validateDateTime(interaction) {
        const dateStr = interaction.options.getString('date');
        const timeStr = interaction.options.getString('heure');

        // Validation de la date
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const dateMatch = dateStr.match(dateRegex);
        if (!dateMatch) {
            await interaction.reply({
                content: '*Fronce les sourcils avec élégance*\nLe format de la date doit être JJ/MM/YYYY.',
                ephemeral: true
            });
            return { valid: false };
        }

        // Validation de l'heure
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeStr)) {
            await interaction.reply({
                content: '*Fronce les sourcils avec élégance*\nLe format de l\'heure doit être HH:MM.',
                ephemeral: true
            });
            return { valid: false };
        }

        const [, day, month, year] = dateMatch;
        const [hours, minutes] = timeStr.split(':').map(Number);

        const sessionDate = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();

        if (sessionDate < now) {
            await interaction.reply({
                content: '*Médite sur les paradoxes temporels avec consternation*\nMême mon illumination ne me permet pas de remonter le temps...',
                ephemeral: true
            });
            return { valid: false };
        }

        return { valid: true, sessionDate };
    }
};