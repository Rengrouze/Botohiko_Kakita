const cron = require('node-cron');
const config = require('../../../config/config');
const messageService = require('../messageService/messageService');
const SessionManager = require('./sessionManager');
const ResponseManager = require('./responseManager');
const EventManager = require('./eventManager');
const EmbedTemplates = require('../messageService/embedTemplates');
const ButtonTemplates = require('../messageService/buttonTemplates');

class ReminderService {
    constructor(client) {
        this.client = client;
        this.sessionManager = new SessionManager(client);
        this.eventManager = new EventManager(client, this.sessionManager);
        this.responseManager = new ResponseManager(client, this.sessionManager, this.eventManager);

        this.setupModalHandler();
        this.setupFutureConfirmationHandler();
        this.startScheduler();
    }

    setupModalHandler() {
        this.client.on('interactionCreate', async interaction => {
            if (interaction.isModalSubmit() && interaction.customId === 'timeModal') {
                await this.responseManager.handleTimeModalSubmit(interaction);
            }
        });
    }

    setupFutureConfirmationHandler() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            // Gérer la confirmation de session future
            if (interaction.customId === 'future_confirm' ||
                interaction.customId === 'future_cancel' ||
                interaction.customId === 'future_unsure') {
                await this.handleFutureSessionConfirmation(interaction);
            }
        });
    }

    async handleFutureSessionConfirmation(interaction) {
        // Vérifier que seul le MJ peut répondre
        if (interaction.user.id !== config.targetUserId) {
            await interaction.reply({
                content: '*Médite sur l\'audace de l\'impudent*\nSeul notre vénérable Maître de Jeu peut confirmer la session...',
                ephemeral: true
            });
            return;
        }

        try {
            switch (interaction.customId) {
                case 'future_confirm':
                    // Confirmer la session existante
                    await this.eventManager.createEvent({ channel: await this.responseManager.getNotificationChannel() });
                    await interaction.reply({
                        content: '*Arrange son hakama avec satisfaction*\nLa session est confirmée.',
                        ephemeral: true
                    });
                    break;

                case 'future_cancel':
                    // Annuler la session
                    await this.sessionManager.cancelSession(
                        'Session annulée lors de la confirmation quotidienne',
                        await this.responseManager.getNotificationChannel()
                    );
                    await interaction.reply({
                        content: '*Soupire avec une élégance résignée*\nLa session est annulée.',
                        ephemeral: true
                    });
                    break;

                case 'future_unsure':
                    // Laisser en attente, mais désactiver les boutons
                    await interaction.update({
                        components: [ButtonTemplates.futureConfirmation(true)]
                    });
                    await interaction.followUp({
                        content: '*Médite sur l\'incertitude*\nVos doutes sont entendus. La session reste en suspens.',
                        ephemeral: true
                    });
                    break;
            }
        } catch (error) {
            console.error('Erreur lors de la confirmation de session:', error);
            await interaction.reply({
                content: '*Fronce les sourcils avec inquiétude*\nUne perturbation cosmique est survenue...',
                ephemeral: true
            });
        }
    }

    startScheduler() {
        if (!cron.validate(config.scheduleTime)) {
            console.error('Expression cron invalide:', config.scheduleTime);
            return;
        }

        cron.schedule(config.scheduleTime, () => this.sendReminder());
        console.log(`Planificateur démarré. Messages programmés pour: ${config.scheduleTime}`);
    }

    async sendReminder() {
        try {
            const targetUser = await this.client.users.fetch(config.targetUserId);
            if (!targetUser) return;

            // Vérifier s'il y a une session future
            const hasFutureSession = await this.sessionManager.checkDailySession(targetUser);

            // Si pas de session future ou session future déjà confirmée pour aujourd'hui
            if (!hasFutureSession) {
                // Créer une session factice pour le jour même
                const testSessionDate = new Date();
                testSessionDate.setHours(14, 0, 0, 0); // À 14h

                // Réinitialiser les sessions précédentes
                this.sessionManager.resetSessions();

                // Configurer la session courante
                this.sessionManager.currentSession = {
                    date: testSessionDate,
                    time: '14:00',
                    responses: new Map(),
                    timeout: null
                };

                await messageService.sendDailyMessage(targetUser);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du rappel:', error);
        }
    }

    async handleResponse(interaction) {
        await this.responseManager.handleResponse(interaction);
    }
}

module.exports = ReminderService;