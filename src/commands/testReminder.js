const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testreminder')
        .setDescription('Teste l\'envoi du message quotidien'),

    async execute(interaction) {
        // Check if user can do this
        if (interaction.user.id !== config.creatorId) {
            await interaction.reply({
                content: '*Médite sur l\'audace de l\'impudent*\nSeul le vénérable Rengret (donc moi même) peut utiliser cette commande...',
                ephemeral: true
            });
            return;
        }

        try {
            await interaction.client.reminderService.sendReminder();
            await interaction.reply({
                content: '*Incline respectueusement la tête*\nLe message de test a été envoyé avec succès.',
                ephemeral: true
            });
        } catch (error) {
            console.error('Erreur lors du test du reminder:', error);
            await interaction.reply({
                content: '*Fronce les sourcils avec inquiétude*\nUne perturbation dans l\'harmonie des messages est survenue.',
                ephemeral: true
            });
        }
    },
};