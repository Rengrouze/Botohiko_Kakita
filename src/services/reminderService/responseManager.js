const Logger = require('../../utils/logger');
const ErrorHandler = require('../../utils/errorHandler');
const config = require('../../../config/config');
const messageService = require('../messageService/messageService');
const ButtonTemplates = require('../messageService/buttonTemplates');

class ResponseManager {
    constructor(client, sessionManager, eventManager) {
        this.client = client;
        this.sessionManager = sessionManager;
        this.eventManager = eventManager;
        this.antiSpam = new Map();
        Logger.info('ResponseManager', 'constructor', 'Initialized');
    }

    isSpamming(userId) {
        Logger.debug('ResponseManager', 'isSpamming', `Checking spam for user ${userId}`);
        const lastTime = this.antiSpam.get(userId);
        const now = Date.now();
        if (lastTime && now - lastTime < 2000) {
            Logger.warn('ResponseManager', 'isSpamming', `Spam detected for user ${userId}`);
            return true;
        }
        this.antiSpam.set(userId, now);
        return false;
    }

    async handleResponse(interaction) {
        try {
            Logger.info('ResponseManager', 'handleResponse',
                `Received ${interaction.customId} from user ${interaction.user.id}`);

            if (!interaction.isButton()) {
                Logger.debug('ResponseManager', 'handleResponse', 'Not a button interaction');
                return;
            }

            const buttonId = interaction.customId;
            if (this.isSpamming(interaction.user.id)) {
                await interaction.reply({
                    content: config.messages.errors.spamming,
                    ephemeral: true
                });
                return;
            }

            switch (true) {
                case buttonId.startsWith('future_'):
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing future response');
                    await this.handleFutureResponse(interaction);
                    break;
                case buttonId === 'confirm_session' || buttonId === 'cancel_session':
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing session confirmation');
                    await this.handleConfirmation(interaction);
                    break;
                case buttonId.startsWith('player_'):
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing player response');
                    await this.handlePlayerResponse(interaction);
                    break;
                case buttonId === 'yes':
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing daily yes');
                    await this.handleDailyYes(interaction);
                    break;
                case buttonId === 'no':
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing daily no');
                    await this.handleDailyNo(interaction);
                    break;
                case buttonId === 'update_yes' || buttonId === 'update_no':
                    Logger.debug('ResponseManager', 'handleResponse', 'Processing session update response');
                    await this.handleSessionUpdateResponse(interaction);
                    break;
                default:
                    Logger.warn('ResponseManager', 'handleResponse', `Unknown button ID: ${buttonId}`);
            }
        } catch (error) {
            await ErrorHandler.handle(error, 'ResponseManager', 'handleResponse', interaction);
        }
    }
    async handleSessionUpdateResponse(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleSessionUpdateResponse', `Handling session update response for user ${interaction.user.id}`);

            // Vérifier les deux types de sessions
            const isFutureSessionActive = this.sessionManager.isFutureSessionActive();
            const isCurrentSessionActive = this.sessionManager.isCurrentSessionActive();

            if (!isFutureSessionActive && !isCurrentSessionActive) {
                Logger.warn('ResponseManager', 'handleSessionUpdateResponse', 'No session active');
                await interaction.reply({
                    content: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit planifiée...',
                    ephemeral: true
                });
                return;
            }

            const isAvailable = interaction.customId === 'update_yes';
            const responseMessages = {
                yes: '*Hoche la tête avec satisfaction*\nVotre intérêt pour cette session future est noté avec attention.',
                no: '*Soupire avec une élégance résignée*\nLes voies du destin sont parfois impénétrables...'
            };

            Logger.info('ResponseManager', 'handleSessionUpdateResponse', `User ${interaction.user.id} responded with ${isAvailable ? 'yes' : 'no'}`);

            await interaction.reply({
                content: isAvailable ? responseMessages.yes : responseMessages.no,
                ephemeral: true
            });

            // Privilégier futureSession si elle existe
            const sessionType = isFutureSessionActive ? 'future' : 'current';

            // Mettre à jour la réponse de l'utilisateur
            this.sessionManager.setPlayerResponse(interaction.user.id, isAvailable ? 'yes' : 'no', sessionType);

            // Mettre à jour le statut des réponses
            await this.updateResponsesStatus(interaction);

            // Désactiver les boutons du message
            if (interaction.message) {
                await interaction.message.edit({
                    components: [ButtonTemplates.futureUpdate(true)]
                });
            }
        } catch (error) {
            Logger.error('ResponseManager', 'handleSessionUpdateResponse', `Error handling session update response: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handleSessionUpdateResponse', interaction);
        }
    }

    async handleFutureResponse(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleFutureResponse', `Handling future response for user ${interaction.user.id}`);

            if (!this.sessionManager.isFutureSessionActive()) {
                Logger.warn('ResponseManager', 'handleFutureResponse', 'No future session active');
                await interaction.reply({
                    content: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit planifiée...',
                    ephemeral: true
                });
                return;
            }

            const response = interaction.customId.split('_')[1];
            const responseMessages = {
                yes: '*Hoche la tête avec satisfaction*\nVotre intérêt pour cette session future est noté avec attention.',
                no: '*Soupire avec une élégance résignée*\nLes voies du destin sont parfois impénétrables...',
                maybe: '*Médite sur l\'incertitude*\nLe doute est parfois le premier pas vers la sagesse...'
            };

            Logger.info('ResponseManager', 'handleFutureResponse', `User ${interaction.user.id} responded with ${response}`);

            await interaction.reply({
                content: responseMessages[response],
                ephemeral: true
            });

            this.sessionManager.setPlayerResponse(interaction.user.id, response, 'future');
            await this.updateResponsesStatus(interaction);
        } catch (error) {
            Logger.error('ResponseManager', 'handleFutureResponse', `Error handling future response: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handleFutureResponse', interaction);
        }
    }

    async handleConfirmation(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleConfirmation', `Handling confirmation for user ${interaction.user.id}`);

            if (interaction.user.id !== config.targetUserId) {
                Logger.warn('ResponseManager', 'handleConfirmation', `User ${interaction.user.id} is not the Game Master`);
                await interaction.reply({
                    content: '*Médite sur l\'audace de l\'impudent*\nSeul notre vénérable Maître de Jeu peut décider du maintien de la session...',
                    ephemeral: true
                });
                return;
            }

            const isConfirming = interaction.customId === 'confirm_session';
            Logger.info('ResponseManager', 'handleConfirmation', `Game Master is ${isConfirming ? 'confirming' : 'cancelling'} the session`);

            if (isConfirming) {
                await this.eventManager.createEvent(interaction);
            } else {
                await this.sessionManager.cancelSession('Session annulée par le MJ', interaction.channel);
            }

            await interaction.reply({
                content: isConfirming
                    ? '*Arrange son hakama avec satisfaction*\nExcellent, je vais confirmer la session aux disciples.'
                    : '*Soupire avec une élégance résignée*\nJ\'informerai les disciples de l\'annulation...',
                ephemeral: true
            });
        } catch (error) {
            Logger.error('ResponseManager', 'handleConfirmation', `Error handling confirmation: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handleConfirmation', interaction);
        }
    }

    async handlePlayerResponse(interaction) {
        try {
            Logger.debug('ResponseManager', 'handlePlayerResponse', `Handling player response for user ${interaction.user.id}`);

            if (!this.sessionManager.isCurrentSessionActive()) {
                Logger.warn('ResponseManager', 'handlePlayerResponse', 'No current session active');
                await interaction.reply({
                    content: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit actuellement planifiée...',
                    ephemeral: true
                });
                return;
            }

            if (this.sessionManager.hasPlayerResponded(interaction.user.id)) {
                Logger.warn('ResponseManager', 'handlePlayerResponse', `User ${interaction.user.id} has already responded`);
                await interaction.reply({
                    content: '*Hausse un sourcil désapprobateur*\nVous avez déjà fait connaître votre disponibilité...',
                    ephemeral: true
                });
                return;
            }

            const isAvailable = interaction.customId === 'player_yes';
            Logger.info('ResponseManager', 'handlePlayerResponse', `User ${interaction.user.id} is ${isAvailable ? 'available' : 'not available'}`);

            this.sessionManager.setPlayerResponse(interaction.user.id, isAvailable);

            await interaction.reply({
                content: isAvailable
                    ? '*Incline légèrement la tête*\nVotre disponibilité est notée avec la plus grande attention.'
                    : '*Soupire avec une élégance résignée*\nLes voies du planning sont parfois impénétrables...',
                ephemeral: true
            });

            // Désactiver les boutons après la réponse
            if (interaction.message) {
                await interaction.message.edit({
                    components: [ButtonTemplates.playerResponse(true)]
                });
            }

            // Si un joueur n'est pas disponible, annuler la session
            if (!isAvailable) {
                Logger.info('ResponseManager', 'handlePlayerResponse', 'A player is not available, cancelling session');
                await this.sessionManager.cancelSession(
                    'Un joueur n\'est pas disponible',
                    await this.getNotificationChannel()
                );
                return;
            }

            await this.checkAllResponses();
        } catch (error) {
            Logger.error('ResponseManager', 'handlePlayerResponse', `Error handling player response: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handlePlayerResponse', interaction);
        }
    }

    async checkAllResponses() {
        try {
            Logger.debug('ResponseManager', 'checkAllResponses', 'Checking all player responses');

            const responses = this.sessionManager.getSessionResponses();
            const allResponded = config.playerIds.every(id => responses.has(id));
            const allAvailable = Array.from(responses.values()).every(response => response === true);

            if (allResponded && allAvailable) {
                Logger.info('ResponseManager', 'checkAllResponses', 'All players are available, creating event');
                const channel = await this.getNotificationChannel();
                if (channel) {
                    await this.eventManager.createEvent({ channel });
                }
            }
        } catch (error) {
            Logger.error('ResponseManager', 'checkAllResponses', `Error checking all responses: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'checkAllResponses');
        }
    }

    async handleTimeModalSubmit(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleTimeModalSubmit', `Handling time modal submit for user ${interaction.user.id}`);

            const time = interaction.fields.getTextInputValue('timeInput');

            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(time)) {
                Logger.warn('ResponseManager', 'handleTimeModalSubmit', `Invalid time format: ${time}`);
                await interaction.reply({
                    content: '*Fronce les sourcils avec élégance*\nLe format de l\'heure doit être HH:MM. Vous pouvez réessayer en cliquant à nouveau sur le bouton.',
                    ephemeral: true
                });
                return;
            }

            // Calcul de l'heure de session
            const [hours, minutes] = time.split(':').map(Number);
            const sessionTime = new Date();
            sessionTime.setHours(hours, minutes, 0, 0);

            const now = new Date();
            if (sessionTime < now) {
                Logger.warn('ResponseManager', 'handleTimeModalSubmit', `Time is in the past: ${time}`);
                await interaction.reply({
                    content: '*Médite sur les paradoxes temporels avec consternation*\nMême mon illumination ne me permet pas de remonter le temps... Proposez une heure future en cliquant à nouveau sur le bouton.',
                    ephemeral: true
                });
                return;
            }

            this.sessionManager.currentSession.time = time;
            this.sessionManager.currentSession.responses.clear();

            await interaction.reply({
                content: `*Arrange son hakama avec satisfaction*\nExcellent, je vais informer les autres de votre disponibilité à partir de ${time}.`,
                ephemeral: true
            });

            const message = await interaction.message;
            if (message) {
                const disabledButtons = ButtonTemplates.dailyChoice(true);
                await message.edit({ components: [disabledButtons] });
            }

            let notifiedPlayers = 0;
            for (const playerId of config.playerIds) {
                try {
                    const player = await this.client.users.fetch(playerId);
                    if (player) {
                        await messageService.sendPlayerNotification(player, time);
                        notifiedPlayers++;
                    }
                } catch (error) {
                    Logger.error('ResponseManager', 'handleTimeModalSubmit', `Error notifying player ${playerId}: ${error.message}`);
                }
            }

            if (notifiedPlayers === 0) {
                Logger.error('ResponseManager', 'handleTimeModalSubmit', 'No players could be notified');
                await interaction.followUp({
                    content: '*Fronce les sourcils avec inquiétude*\nJe n\'ai pas pu notifier les joueurs...',
                    ephemeral: true
                });
            }
        } catch (error) {
            Logger.error('ResponseManager', 'handleTimeModalSubmit', `Error handling time modal submit: ${error.message}`);
            const response = '*Fronce les sourcils avec élégance*\nUne perturbation dans l\'harmonie des notifications...';
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: response, ephemeral: true });
            } else {
                await interaction.followUp({ content: response, ephemeral: true });
            }
        }
    }

    validateTimeFormat(time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }

    async notifySessionScheduled(interaction, time) {
        try {
            Logger.debug('ResponseManager', 'notifySessionScheduled', `Notifying session scheduled for time ${time}`);

            await interaction.reply({
                content: `*Arrange son hakama avec satisfaction*\nExcellent, je vais informer les autres de votre disponibilité à partir de ${time}.`,
                ephemeral: true
            });

            if (interaction.message) {
                await interaction.message.edit({
                    components: [ButtonTemplates.dailyChoice(true)]
                });
            }

            // Notifier les joueurs
            let notifiedPlayers = 0;
            for (const playerId of config.playerIds) {
                try {
                    const player = await this.client.users.fetch(playerId);
                    if (player) {
                        await messageService.sendPlayerNotification(player, time);
                        notifiedPlayers++;
                    }
                } catch (error) {
                    Logger.error('ResponseManager', 'notifySessionScheduled', `Error notifying player ${playerId}: ${error.message}`);
                }
            }

            if (notifiedPlayers === 0) {
                Logger.error('ResponseManager', 'notifySessionScheduled', 'No players could be notified');
                await interaction.followUp({
                    content: '*Fronce les sourcils avec inquiétude*\nJe n\'ai pas pu notifier les joueurs...',
                    ephemeral: true
                });
            }
        } catch (error) {
            Logger.error('ResponseManager', 'notifySessionScheduled', `Error notifying session scheduled: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'notifySessionScheduled', interaction);
        }
    }

    async handleDailyYes(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleDailyYes', `Handling daily yes for user ${interaction.user.id}`);

            const modal = messageService.createTimeModal();
            await interaction.showModal(modal);
        } catch (error) {
            Logger.error('ResponseManager', 'handleDailyYes', `Error handling daily yes: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handleDailyYes', interaction);
        }
    }

    async handleDailyNo(interaction) {
        try {
            Logger.debug('ResponseManager', 'handleDailyNo', `Handling daily no for user ${interaction.user.id}`);

            const refusalMessage = config.getRandomRefusal();
            await interaction.reply({
                content: refusalMessage,
                ephemeral: true
            });
        } catch (error) {
            Logger.error('ResponseManager', 'handleDailyNo', `Error handling daily no: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'handleDailyNo', interaction);
        }
    }

    async handleError(interaction) {
        const response = '*Fronce les sourcils avec élégance*\nUne perturbation dans l\'harmonie des notifications...';
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: response, ephemeral: true });
        } else {
            await interaction.followUp({ content: response, ephemeral: true });
        }
    }

    async getNotificationChannel() {
        try {
            Logger.debug('ResponseManager', 'getNotificationChannel', 'Fetching notification channel');

            const guild = this.client.guilds.cache.get(config.guildId);
            if (!guild) {
                Logger.warn('ResponseManager', 'getNotificationChannel', 'Guild not found');
                return null;
            }
            return await guild.channels.fetch(config.notificationChannelId);
        } catch (error) {
            Logger.error('ResponseManager', 'getNotificationChannel', `Error fetching notification channel: ${error.message}`);
            throw error;
        }
    }

    async updateResponsesStatus(interaction) {
        try {
            Logger.debug('ResponseManager', 'updateResponsesStatus', 'Updating responses status');

            const responses = this.sessionManager.getSessionResponses('future');
            const channel = await this.getNotificationChannel();
            if (!channel) return;

            // Compter les différents types de réponses
            const counts = {
                yes: 0,
                no: 0,
                maybe: 0
            };

            responses.forEach(response => {
                if (counts[response] !== undefined) {
                    counts[response]++;
                }
            });

            // Si tout le monde a répondu
            if (responses.size === config.playerIds.length) {
                if (counts.no > 0) {
                    // Si quelqu'un a dit non, annule
                    Logger.info('ResponseManager', 'updateResponsesStatus', 'A player said no, cancelling session');
                    await this.sessionManager.cancelSession(
                        'Un joueur ne sera pas disponible',
                        channel
                    );
                    return;
                }

                if (counts.maybe > 0) {
                    // Si quelqu'un a dit peut-être, session en attente
                    Logger.info('ResponseManager', 'updateResponsesStatus', 'A player said maybe, session pending');
                    await channel.send({
                        content: `<@&${config.gameRoleId}> *Contemple les astres avec patience*\nLes augures restent incertains pour la session prévue... Attendons que le destin se précise.`
                    });
                    return;
                }

                if (counts.yes === config.playerIds.length) {
                    // Si tout le monde a dit oui, créer l'événement
                    Logger.info('ResponseManager', 'updateResponsesStatus', 'All players said yes, creating event');
                    await this.eventManager.createEvent({ channel });
                    return;
                }
            }

            // Mise à jour du statut normal
            await messageService.updateSessionStatus(
                channel,
                this.sessionManager.futureSession.date.toLocaleDateString('fr-FR'),
                this.sessionManager.futureSession.time,
                responses
            );
        } catch (error) {
            Logger.error('ResponseManager', 'updateResponsesStatus', `Error updating responses status: ${error.message}`);
            await ErrorHandler.handle(error, 'ResponseManager', 'updateResponsesStatus', interaction);
        }
    }
}

module.exports = ResponseManager;