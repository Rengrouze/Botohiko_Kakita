// reminderService.js
const cron = require('node-cron');
const { Events } = require('discord.js');
const config = require('../../config/config');
const messageService = require('./messageService');

class ReminderService {
    constructor(client) {
        this.client = client;
        this.playerResponses = new Map();
        this.sessionTime = null;
        this.setupModalHandler();
    }

    setupModalHandler() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isModalSubmit() && interaction.customId === 'timeModal') {
                await this.handleTimeModalSubmit(interaction);
            }
        });
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
            // Réinitialiser l'état quotidien
            this.playerResponses.clear();
            this.sessionTime = null;
        });

        console.log(`Planificateur démarré. Messages programmés pour: ${config.scheduleTime}`);
    }

    async handleResponse(interaction) {
        try {
            if (!interaction.isButton()) return;

            const buttonId = interaction.customId;

            // Gérer les réponses des joueurs
            if (buttonId.startsWith('player_')) {
                await this.handlePlayerResponse(interaction);
                return;
            }

            // Gérer la réponse du MJ
            if (interaction.user.id !== config.targetUserId) {
                await interaction.reply({
                    content: '*Hausse un sourcil avec une élégance désapprobatrice*\nSeuls les initiés sont autorisés à répondre à cette question...',
                    ephemeral: true
                });
                return;
            }

            if (buttonId === 'yes') {
                const modal = messageService.createTimeModal();
                await interaction.showModal(modal);
            } else if (buttonId === 'no') {
                const refusalResponses = [
                    "*Médite intensément sur la nature du planning vide* Je vois... Le néant nous appelle à nouveau.",
                    "*Arrange son hakama avec une déception parfaitement étudiée* Les voies de l'harmonie sont vraiment... impénétrables.",
                    "*Soupire avec une élégance résignée* Une autre journée à contempler le vide de notre planning...",
                    "*Fait tourner son mala avec une grâce passive-agressive* Le karma se souviendra de ceci.",
                    "*Écrit un haiku dans l'air* 'Comme la rosée / Les espoirs de session fondent / Sous le soleil cruel'",
                    "*Ajuste sa position de méditation* Je vais méditer sur la nature éphémère des opportunités de jeu.",
                    "*Range son katana avec une lenteur délibérée* La voie du bushido nous enseigne aussi la patience... Beaucoup de patience.",
                    "*Disperse des pétales de cerisier imaginaires* Aussi éphémères que nos sessions...",
                    "*Consulte les augures* Ah... Les présages avaient prédit ce refus. Comme les 257 précédents.",
                    "*Lisse son jardin zen avec une précision passive-agressive* Un autre motif dans le sable de nos reports..."
                ];

                const randomRefusal = refusalResponses[Math.floor(Math.random() * refusalResponses.length)];
                await interaction.reply({
                    content: randomRefusal,
                    ephemeral: true
                });
            }

            // Désactiver les boutons après la réponse
            if (interaction.message) {
                const disabledButtons = messageService.createDisabledButtons();
                await interaction.message.edit({ components: [disabledButtons] });
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

            // Valider le format de l'heure (HH:MM)
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(time)) {
                await interaction.reply({
                    content: '*Fronce les sourcils avec élégance*\nLe format de l\'heure doit être HH:MM.',
                ephemeral: true
            });
                return;
            }

            // Stocker l'heure de la session
            this.sessionTime = time;

            // Réinitialiser les réponses des joueurs
            this.playerResponses.clear();

            await interaction.reply({
                content: `*Arrange son hakama avec satisfaction*\nExcellent, je vais informer les autres de votre disponibilité à partir de ${time}.`,
                ephemeral: true
            });

            // Notifier les autres joueurs
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
            }
        } catch (error) {
            console.error('Erreur dans handleTimeModalSubmit:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '*Fronce les sourcils avec élégance*\nUne perturbation dans l\'harmonie des notifications...',
                    ephemeral: true
                });
            }
        }
    }

    // Dans reminderService.js
    async handlePlayerResponse(interaction) {
        try {
            const isAvailable = interaction.customId === 'player_yes';
            const playerId = interaction.user.id;

            console.log(`Réponse reçue du joueur ${playerId}: ${isAvailable ? 'disponible' : 'non disponible'}`);

            if (!this.sessionTime) {
                console.error('Pas d\'heure de session définie');
                await interaction.reply({
                    content: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit actuellement planifiée...',
                    ephemeral: true
                });
                return;
            }

            await interaction.reply({
                content: isAvailable
                    ? '*Incline légèrement la tête*\nVotre disponibilité est notée avec la plus grande attention.'
                    : '*Soupire avec une élégance résignée*\nLes voies du planning sont parfois impénétrables...',
                ephemeral: true
            });

            this.playerResponses.set(playerId, isAvailable);
            console.log('État actuel des réponses:', Object.fromEntries(this.playerResponses));

            const allResponded = config.playerIds.every(id => this.playerResponses.has(id));
            const allAvailable = Array.from(this.playerResponses.values()).every(response => response === true);

            console.log('Statut des réponses:', {
                nombreDeReponses: this.playerResponses.size,
                totalJoueurs: config.playerIds.length,
                tousOntRepondu: allResponded,
                tousSontDisponibles: allAvailable
            });

            if (allResponded && allAvailable) {
                try {
                    // Récupérer la guild via le client
                    const guild = this.client.guilds.cache.get(config.guildId);

                    if (!guild) {
                        console.error('Guild non trouvée. ID:', config.guildId);
                        return;
                    }

                    console.log('Guild trouvée:', guild.name);

                    // Vérifier les permissions du bot dans la guild
                    const botMember = await guild.members.fetch(this.client.user.id);
                    console.log('Permissions du bot dans la guild:', botMember.permissions.toArray());

                    // Récupérer le canal
                    const channel = await guild.channels.fetch(config.notificationChannelId);

                    if (!channel) {
                        console.error('Canal non trouvé. ID:', config.notificationChannelId);
                        return;
                    }

                    console.log('Canal trouvé:', channel.name);

                    // Vérifier les permissions spécifiques au canal
                    const permissions = channel.permissionsFor(this.client.user);
                    console.log('Permissions du bot dans le canal:', permissions ? permissions.toArray() : 'Aucune permission');

                    await this.createGameEvent(channel);
                } catch (error) {
                    console.error('Erreur détaillée lors de la récupération du canal:', error);
                    await interaction.followUp({
                        content: '*Médite intensément sur une erreur*\nLes voies de l\'harmonie sont perturbées... Erreur: ' + error.message,
                        ephemeral: true
                    });
                }
            }

            if (interaction.message) {
                const disabledButtons = messageService.createDisabledButtons();
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
                    content: `*Fait tinter une cloche de temple avec grâce*\n\nUne session a été programmée pour ${this.sessionTime} !\nRetrouvez-vous dans le salon vocal <#${config.gameVoiceChannelId}>.`
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
}

module.exports = ReminderService;