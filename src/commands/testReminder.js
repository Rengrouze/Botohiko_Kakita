const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config/config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testreminder')
        .setDescription('Teste l\'envoi du message quotidien'),

    async execute(interaction) {
        if (interaction.user.id !== config.creatorId) {
            await interaction.reply({
                content: '*Médite sur l\'audace de l\'impudent*\nSeul le vénérable Rengret peut utiliser cette commande...',
                ephemeral: true
            });
            return;
        }

        try {
            // Créer une session factice pour le test
            const testSessionDate = new Date();
            testSessionDate.setDate(testSessionDate.getDate() + 1); // Demain
            testSessionDate.setHours(14, 0, 0, 0); // À 14h

            interaction.client.reminderService.sessionManager.futureSession = {
                date: testSessionDate,
                time: '14:00',
                responses: new Map()
            };

            // Envoyer le reminder
            await interaction.client.reminderService.sendReminder();

            await interaction.reply({
                content: '*Incline respectueusement la tête*\nLe message de test a été envoyé avec succès.\nUne session factice a été créée pour tester les réponses.',
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