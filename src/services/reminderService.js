const cron = require('node-cron');
const { Events } = require('discord.js');
const config = require('../../config/config');
const messageService = require('./messageService');

class ReminderService {
    constructor(client) {
        this.client = client;
        this.playerResponses = new Map();
        this.sessionTime = null;
        this.lastInteraction = new Map(); // anti spam
        this.setupModalHandler();
    }



    setupModalHandler() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isModalSubmit() && interaction.customId === 'timeModal') {
                await this.handleTimeModalSubmit(interaction);
            }
        });
    }

    isSpamming(userId) {
        const lastTime = this.lastInteraction.get(userId);
        const now = Date.now();
        if (lastTime && now - lastTime < 2000) { // 2 seconds delay minimum
            return true;
        }
        this.lastInteraction.set(userId, now);
        return false;
    }

    async sendReminder() {
        try {
            const targetUser = await this.client.users.fetch(config.targetUserId);
            if (!targetUser) {
                console.error('Utilisateur cible non trouvé');
                return;
            }
            await messageService.sendDailyMessage(targetUser);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du rappel:', error);
        }
    }

    startScheduler() {
        if (!cron.validate(config.scheduleTime)) {
            console.error('Expression cron invalide:', config.scheduleTime);
            return;
        }

        cron.schedule(config.scheduleTime, () => {
            this.sendReminder();
            this.playerResponses.clear();
            this.sessionTime = null;
        });

        console.log(`Planificateur démarré. Messages programmés pour: ${config.scheduleTime}`);
    }

    async handleResponse(interaction) {
        try {
            if (!interaction.isButton()) return;

            const buttonId = interaction.customId;
            if (this.isSpamming(interaction.user.id)) {
                await interaction.reply({
                    content: config.messages.errors.spamming,
                    ephemeral: true
                });
                return;
            }
            if (buttonId.startsWith('player_')) {
                await this.handlePlayerResponse(interaction);
                return;
            }
            if (interaction.user.id !== config.targetUserId) {
                await interaction.reply({
                    content: config.formatMessage(config.messages.success.eventCreated, {
                        time: this.sessionTime,
                        channelId: config.gameVoiceChannelId
                    }),
                    ephemeral: true
                });

            }

            if (buttonId === 'yes') {
                const modal = messageService.createTimeModal();
                await interaction.showModal(modal);
            } else if (buttonId === 'no') {
                const refusalMessage = config.getRandomRefusal();
                await interaction.reply({
                    content: refusalMessage,
                    ephemeral: true
                });
                if (interaction.message) {
                    const disabledButtons = messageService.createDisabledButtons();
                    await interaction.message.edit({ components: [disabledButtons] });
                }
            }
        } catch (error) {
            console.error('Erreur dans handleResponse:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '*Médite sur une erreur inattendue*\nLes voies du code sont parfois mystérieuses...',
                    ephemeral: true
                });
            }
        }
    }

    async handleTimeModalSubmit(interaction) {
        try {
            const time = interaction.fields.getTextInputValue('timeInput');

            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(time)) {
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
                await interaction.reply({
                    content: '*Médite sur les paradoxes temporels avec consternation*\nMême mon illumination ne me permet pas de remonter le temps... Proposez une heure future en cliquant à nouveau sur le bouton.',
                    ephemeral: true
                });
                return;
            }

            this.sessionTime = time;
            this.playerResponses.clear();

            await interaction.reply({
                content: `*Arrange son hakama avec satisfaction*\nExcellent, je vais informer les autres de votre disponibilité à partir de ${time}.`,
                ephemeral: true
            });

            const message = await interaction.message;
            if (message) {
                const disabledButtons = messageService.createDisabledButtons();
                await message.edit({ components: [disabledButtons] });
            }

            // Calcul du délai avant timeout (30 minutes avant la session)
            const thirtyMinutesBeforeSession = new Date(sessionTime);
            thirtyMinutesBeforeSession.setMinutes(thirtyMinutesBeforeSession.getMinutes() - 30);

            const timeoutDelay = thirtyMinutesBeforeSession.getTime() - now.getTime();

            // Si on a plus de 30 minutes avant la session
            if (timeoutDelay > 0) {
                if (this.responseTimeout) {
                    clearTimeout(this.responseTimeout);
                }

                console.log(`Timeout programmé pour dans ${Math.floor(timeoutDelay / 60000)} minutes`);

                this.responseTimeout = setTimeout(() => {
                    this.handleResponseTimeout();
                }, timeoutDelay);
            } else {
                console.log('Session trop proche, pas de timeout nécessaire');
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
                    console.error(`Erreur lors de la notification du joueur ${playerId}:`, error);
                }
            }

            if (notifiedPlayers === 0) {
                console.error('Aucun joueur n\'a pu être notifié');
                await interaction.followUp({
                    content: '*Fronce les sourcils avec inquiétude*\nJe n\'ai pas pu notifier les joueurs...',
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error('Erreur dans handleTimeModalSubmit:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '*Fronce les sourcils avec élégance*\nUne perturbation dans l\'harmonie des notifications...',
                    ephemeral: true
                });
            } else {
                await interaction.followUp({
                    content: '*Fronce les sourcils avec élégance*\nUne perturbation dans l\'harmonie des notifications...',
                    ephemeral: true
                });
            }
        }
    }

    // Dans reminderService.js
    async handlePlayerResponse(interaction) {
        try {
            if (!this.sessionTime) {
                await interaction.reply({
                    content: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit actuellement planifiée...',
                    ephemeral: true
                });
                return;
            }

            // Vérifier si le joueur a déjà répondu
            if (this.playerResponses.has(interaction.user.id)) {
                await interaction.reply({
                    content: '*Hausse un sourcil désapprobateur*\nVous avez déjà fait connaître votre disponibilité...',
                    ephemeral: true
                });
                return;
            }

            const isAvailable = interaction.customId === 'player_yes';

            await interaction.reply({
                content: isAvailable
                    ? '*Incline légèrement la tête*\nVotre disponibilité est notée avec la plus grande attention.'
                    : '*Soupire avec une élégance résignée*\nLes voies du planning sont parfois impénétrables...',
                ephemeral: true
            });

            this.playerResponses.set(interaction.user.id, isAvailable);

            // Si un joueur n'est pas disponible, annuler la session
            if (!isAvailable) {
                const guild = this.client.guilds.cache.get(config.guildId);
                if (guild) {
                    const channel = await guild.channels.fetch(config.notificationChannelId);
                    if (channel) {
                        await channel.send({
                            content: `<@&${config.gameRoleId}> *Soupire avec une élégance résignée*\nLes astres ne sont pas alignés aujourd\'hui... Session annulée.`
                        });
                    }
                }
                this.resetSessionState();
                return;
            }

            const allResponded = config.playerIds.every(id => this.playerResponses.has(id));
            const allAvailable = Array.from(this.playerResponses.values()).every(response => response === true);

            if (allResponded && allAvailable) {
                try {
                    const guild = this.client.guilds.cache.get(config.guildId);
                    if (!guild) {
                        console.error('Guild non trouvée. ID:', config.guildId);
                        return;
                    }

                    const channel = await guild.channels.fetch(config.notificationChannelId);
                    if (!channel) {
                        console.error('Canal non trouvé. ID:', config.notificationChannelId);
                        return;
                    }

                    await this.createGameEvent(channel);
                } catch (error) {
                    console.error('Erreur lors de la création de l\'événement:', error);
                    await interaction.followUp({
                        content: '*Médite intensément sur une erreur*\nLes voies de l\'harmonie sont perturbées...',
                        ephemeral: true
                    });
                }
            }

            // Désactiver les boutons après la réponse
            if (interaction.message) {
                const disabledButtons = messageService.createDisabledPlayerButtons();
                await interaction.message.edit({ components: [disabledButtons] });
            }
        } catch (error) {
            console.error('Erreur dans handlePlayerResponse:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...',
                    ephemeral: true
                });
            }
        }
    }

    async handleResponseTimeout() {
        if (!this.sessionTime) return;

        const guild = this.client.guilds.cache.get(config.guildId);
        if (!guild) return;

        try {
            const channel = await guild.channels.fetch(config.notificationChannelId);
            if (channel) {
                await channel.send({
                    content: `<@&${config.gameRoleId}> *Contemple le sablier vide*\nLe temps imparti pour les réponses est écoulé... La session est annulée.`
                });
            }
        } catch (error) {
            console.error('Erreur lors du timeout des réponses:', error);
        } finally {
            this.resetSessionState();
        }
    }
    async createGameEvent(channel) {
        try {
            if (!this.sessionTime) {
                console.error('Pas d\'heure de session définie');
                return;
            }

            console.log('Tentative de création d\'événement avec les paramètres suivants:', {
                channelId: channel.id,
                guildId: channel.guild.id,
                voiceChannelId: config.gameVoiceChannelId,
                sessionTime: this.sessionTime
            });

            // Vérifier les permissions avant de créer l'événement
            const permissions = channel.guild.members.me.permissions;
            console.log('Permissions du bot:', permissions.toArray());

            // Créer une date pour l'événement
            const [hours, minutes] = this.sessionTime.split(':').map(Number);
            const eventDate = new Date();
            eventDate.setHours(hours, minutes, 0, 0);

            // Si l'heure est déjà passée, programmer pour le lendemain
            if (eventDate < new Date()) {
                eventDate.setDate(eventDate.getDate() + 1);
            }

            // Ajouter 3 heures par défaut pour la durée de l'événement
            const endDate = new Date(eventDate);
            endDate.setHours(endDate.getHours() + 3);

            console.log('Date de l\'événement:', eventDate);

            const event = await channel.guild.scheduledEvents.create({
                name: 'Session de Legend of the Five Rings',
                scheduledStartTime: eventDate,
                scheduledEndTime: endDate,        // Ajout d'une heure de fin
                privacyLevel: 2,                  // GUILD_ONLY
                entityType: 2,                    // VOICE
                channel: config.gameVoiceChannelId,
                description: '*Déroule élégamment un parchemin*\nLes astres se sont alignés pour une session de jeu.',
                entityMetadata: {
                    location: null                 // Requis même si null pour les événements de type VOICE
                }
            });

            if (event) {
                console.log('Événement créé avec succès:', event.id);
                await channel.send({
                    content: `<@&${config.gameRoleId}> *Fait tinter une cloche de temple avec grâce*\n\nUne session a été programmée pour ${this.sessionTime} !\nRetrouvez-vous dans le salon vocal <#${config.gameVoiceChannelId}>.`
                });

                this.sessionTime = null;
                this.playerResponses.clear();
            }
        } catch (error) {
            console.error('Erreur détaillée lors de la création de l\'événement:', error);
            try {
                if (channel) {
                    await channel.send({
                        content: `*Médite sur une perturbation cosmique*\nUne erreur est survenue lors de la création de l\'événement...\nErreur: ${error.message}`
                    });
                }
            } catch (sendError) {
                console.error('Erreur lors de l\'envoi du message d\'erreur:', sendError);
            }
            throw error;
        }
    }
    resetSessionState() {
        this.sessionTime = null;
        this.playerResponses.clear();
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
            this.responseTimeout = null;
        }
    }
}

module.exports = ReminderService;