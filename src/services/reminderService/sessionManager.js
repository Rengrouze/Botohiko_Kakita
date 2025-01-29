const config = require('../../../config/config');
const messageService = require('../messageService/messageService');

class SessionManager {
    constructor(client) {
        this.client = client;
        this.currentSession = {
            date: null,
            time: null,
            responses: new Map(),
            timeout: null
        };
        this.futureSession = {
            date: null,
            time: null,
            responses: new Map()
        };
    }


    async scheduleFutureSession(interaction, sessionDate) {
        const formattedDate = sessionDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const formattedTime = sessionDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        this.futureSession = {
            date: sessionDate,
            time: formattedTime,
            responses: new Map()
        };

        await this.notifyPlayers(formattedDate, formattedTime);
        await interaction.reply({
            content: `*Arrange son hakama avec satisfaction*\nJ'ai noté la proposition de session pour le ${formattedDate} à ${formattedTime}. Je vais en informer les autres disciples.`,
            ephemeral: true
        });
    }

    async scheduleCurrentSession(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const sessionDate = new Date();
        sessionDate.setHours(hours, minutes, 0, 0);

        this.currentSession = {
            date: sessionDate,
            time: time,
            responses: new Map(),
            timeout: null
        };


        await this.setupSessionTimeout(sessionDate);
        return sessionDate;
    }

    async setupSessionTimeout(sessionDate) {
        if (this.currentSession.timeout) {
            clearTimeout(this.currentSession.timeout);
        }

        const thirtyMinutesBeforeSession = new Date(sessionDate);
        thirtyMinutesBeforeSession.setMinutes(thirtyMinutesBeforeSession.getMinutes() - 30);

        const timeoutDelay = thirtyMinutesBeforeSession.getTime() - Date.now();

        if (timeoutDelay > 0) {
            console.log(`Timeout programmé pour dans ${Math.floor(timeoutDelay / 60000)} minutes`);
            this.currentSession.timeout = setTimeout(() => this.handleSessionTimeout(), timeoutDelay);
        }
    }

    async handleSessionTimeout() {
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
            this.resetSessions();
        }
    }

    async notifyPlayers(date, time) {
        for (const playerId of config.playerIds) {
            try {
                const player = await this.client.users.fetch(playerId);
                if (player) {
                    await messageService.sendFutureSessionRequest(player, date, time);
                }
            } catch (error) {
                console.error(`Erreur lors de la notification du joueur ${playerId}:`, error);
            }
        }
    }

    setPlayerResponse(playerId, response, type = 'current') {
        const session = type === 'current' ? this.currentSession : this.futureSession;

        // Si la session est nulle, utiliser l'autre session
        if (!session.date) {
            const alternateSession = type === 'current' ? this.futureSession : this.currentSession;
            if (alternateSession.date) {
                alternateSession.responses.set(playerId, response);
                return;
            }
        }

        session.responses.set(playerId, response);
    }

    hasPlayerResponded(playerId, type = 'current') {
        const session = type === 'current' ? this.currentSession : this.futureSession;
        return session.responses.has(playerId);
    }

    async checkDailySession(targetUser) {
        // Vérifier s'il y a une session future
        if (this.futureSession.date) {
            const today = new Date();
            const sessionDate = new Date(this.futureSession.date);

            // Si la session future est pour aujourd'hui
            if (sessionDate.toDateString() === today.toDateString()) {
                await this.requestSessionConfirmation(targetUser);
                return true;
            }

            // Si la session future est après aujourd'hui
            if (sessionDate > today) {
                return false;
            }
        }

        // Pas de session future, ou session future dépassée
        return false;
    }

    async requestSessionConfirmation(user) {
        if (!this.futureSession.time) return;
        try {
            const embed = messageService.createSessionConfirmationEmbed(this.futureSession.time);
            const buttons = ButtonTemplates.futureConfirmation();
            await user.send({ embeds: [embed], components: [buttons] });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la confirmation au MJ:', error);
        }
    }
    canScheduleNewSession() {
        if (!this.futureSession.date) return true;

        const now = new Date();
        const futureSessionDate = new Date(this.futureSession.date);

        // Autoriser une nouvelle session si la session future est plus de 24h dans le futur
        return futureSessionDate > new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }


    isFutureSessionActive() {
        return this.futureSession.date !== null;
    }

    isCurrentSessionActive() {
        return this.currentSession.date !== null;
    }

    getCurrentSessionTime() {
        return this.currentSession.time;
    }

    getFutureSessionTime() {
        return this.futureSession.time;
    }

    getSessionResponses(type = 'current') {
        // Essayer la session en cours
        const session = type === 'current' ? this.currentSession : this.futureSession;

        // Si la session demandée est vide, essayer l'autre
        if (!session.date) {
            const alternateSession = type === 'current' ? this.futureSession : this.currentSession;
            if (alternateSession.date) {
                return alternateSession.responses;
            }
        }

        return session.responses;
    }

    async cancelSession(reason = '', channel = null) {
        try {
            if (channel) {
                let message = `<@&${config.gameRoleId}> *Soupire avec une élégance résignée*\nLes astres ne sont plus alignés...`;
                if (reason) {
                    message += `\n\nRaison: ${reason}`;
                }
                message += '\nLa session est annulée.';

                await channel.send({ content: message });
            }

            await this.deleteDiscordEvent();
            this.resetSessions();
        } catch (error) {
            console.error('Erreur lors de l\'annulation de la session:', error);
        }
    }

    async deleteDiscordEvent() {
        // Choisir la session à supprimer (privilégier futureSession)
        const sessionToDelete = this.futureSession.date ? this.futureSession : this.currentSession;

        if (!sessionToDelete.date) {
            console.log('Aucune session à supprimer');
            return;
        }

        const guild = this.client.guilds.cache.get(config.guildId);
        if (!guild) {
            console.log('Guild non trouvée');
            return;
        }

        try {
            const events = await guild.scheduledEvents.fetch();
            console.log(`Événements Discord trouvés : ${events.size}`);

            // Journaliser les détails de chaque événement pour débogage
            events.forEach(e => {
                console.log(`Événement: ${e.name}, Date: ${e.scheduledStartAt}, ID: ${e.id}`);
            });

            const sessionTime = sessionToDelete.time || '14:00'; // Valeur par défaut si pas de temps
            const [hours, minutes] = sessionTime.split(':').map(Number);

            const sessionStartTime = new Date(sessionToDelete.date);
            sessionStartTime.setHours(hours, minutes, 0, 0);

            const event = events.find(e => {
                const eventStartTime = new Date(e.scheduledStartAt);

                // Comparaison plus robuste
                const sameDay =
                    eventStartTime.getFullYear() === sessionStartTime.getFullYear() &&
                    eventStartTime.getMonth() === sessionStartTime.getMonth() &&
                    eventStartTime.getDate() === sessionStartTime.getDate();

                const sameTime =
                    eventStartTime.getHours() === sessionStartTime.getHours() &&
                    eventStartTime.getMinutes() === sessionStartTime.getMinutes();

                return e.name === 'Session de Legend of the Five Rings' && sameDay && sameTime;
            });

            if (event) {
                console.log(`Événement trouvé pour suppression - ID: ${event.id}, Date: ${event.scheduledStartAt}`);
                await event.delete();
                console.log(`Événement Discord supprimé pour la session du ${sessionStartTime.toLocaleString()}`);
            } else {
                console.log('Aucun événement correspondant trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'événement Discord:', error);
        }
    }

    resetSessions() {
        if (this.currentSession.timeout) {
            clearTimeout(this.currentSession.timeout);
        }

        this.currentSession = {
            date: null,
            time: null,
            responses: new Map(),
            timeout: null
        };
        this.futureSession = {
            date: null,
            time: null,
            responses: new Map()
        };
    }
}

module.exports = SessionManager;