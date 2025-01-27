const ReminderService = require('../services/reminderService');
const setupDiscordHeartbeat = require('../utils/discordHearbeat'); // Nouveau module

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot connecté en tant que ${client.user.tag}`);

        // Initialise system
        const reminderService = new ReminderService(client);
        client.reminderService = reminderService; // Stocking service for further usage
        reminderService.startScheduler();

        // Initialise le heartbeat Discord
        const stopHeartbeat = setupDiscordHeartbeat(client);

        // Optionnel : Gérer l'arrêt du bot
        client.on('close', () => {
            stopHeartbeat();
        });
    }
};