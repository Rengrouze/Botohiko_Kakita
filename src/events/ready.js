const ReminderService = require('../services/reminderService/reminderService');
const setupDiscordHeartbeat = require("../utils/discordHearbeat");


module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot connecté en tant que ${client.user.tag}`);

        // Initialise les services
        client.reminderService = new ReminderService(client);

        // Initialise le heartbeat Discord
        const stopHeartbeat = setupDiscordHeartbeat(client);

        // Gestion de l'arrêt du bot
        client.on('close', () => {
            stopHeartbeat();
        });
    }
};