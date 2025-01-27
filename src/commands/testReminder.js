const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testreminder')
        .setDescription('Teste l\'envoi du message quotidien'),

    async execute(interaction) {
        try {
            // Accéder au reminderService depuis le client
            await interaction.client.reminderService.sendReminder();

            await interaction.reply({
                content: 'Message de test envoyé avec succès !',
                ephemeral: true
            });
        } catch (error) {
            console.error('Erreur lors du test du reminder:', error);
            await interaction.reply({
                content: 'Une erreur est survenue lors de l\'envoi du message de test.',
                ephemeral: true
            });
        }
    },
};