const ReminderService = require('../services/reminderService');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot connecté en tant que ${client.user.tag}`);

        // Initialiser le service de rappels
        const reminderService = new ReminderService(client);
        client.reminderService = reminderService; // Stocker le service dans le client pour y accéder ailleurs
        reminderService.startScheduler();
    }
};