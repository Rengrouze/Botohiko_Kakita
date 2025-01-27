const ReminderService = require('../services/reminderService');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot connecté en tant que ${client.user.tag}`);

        // Initialise system
        const reminderService = new ReminderService(client);
        client.reminderService = reminderService; // Stocking service for further usage
        reminderService.startScheduler();
    }
};