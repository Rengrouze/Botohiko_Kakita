const config = require('../../../config/config');

class EventManager {
    constructor(client, sessionManager) {
        this.client = client;
        this.sessionManager = sessionManager;
    }

    async createEvent(interaction) {
        const channel = await this.getNotificationChannel();
        if (!channel) return;

        try {
            const event = await this.createDiscordEvent(channel);
            if (event) {
                await this.announceEvent(channel);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'événement:', error);
            await this.handleError(channel, error);
        }
    }

    async getNotificationChannel() {
        const guild = this.client.guilds.cache.get(config.guildId);
        if (!guild) {
            console.error('Guild non trouvée');
            return null;
        }
        return await guild.channels.fetch(config.notificationChannelId);
    }

    async createDiscordEvent(channel) {
        // Essayer d'abord futureSession, sinon utiliser currentSession
        const eventDate = this.calculateEventDate();
        const endDate = this.calculateEndDate(eventDate);

        return await channel.guild.scheduledEvents.create({
            name: 'Session de Legend of the Five Rings',
            scheduledStartTime: eventDate,
            scheduledEndTime: endDate,
            privacyLevel: 2,
            entityType: 2,
            channel: config.gameVoiceChannelId,
            description: '*Déroule élégamment un parchemin*\nLes astres se sont alignés pour une session de jeu.',
            entityMetadata: { location: null }
        });
    }

    calculateEventDate() {
        let sessionDate;

        // Essayer d'abord futureSession
        if (this.sessionManager.futureSession &&
            this.sessionManager.futureSession.date &&
            this.sessionManager.futureSession.time) {
            sessionDate = new Date(this.sessionManager.futureSession.date);
            const [hours, minutes] = this.sessionManager.futureSession.time.split(':').map(Number);
            sessionDate.setHours(hours, minutes, 0, 0);
            return sessionDate;
        }

        // Si pas de futureSession, utiliser currentSession
        if (this.sessionManager.currentSession &&
            this.sessionManager.currentSession.date &&
            this.sessionManager.currentSession.time) {
            sessionDate = new Date(this.sessionManager.currentSession.date);
            const [hours, minutes] = this.sessionManager.currentSession.time.split(':').map(Number);
            sessionDate.setHours(hours, minutes, 0, 0);
            return sessionDate;
        }

        throw new Error('Aucune session n\'est planifiée');
    }

    calculateEndDate(startDate) {
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 3);
        return endDate;
    }

    async announceEvent(channel) {
        let formattedDate, sessionTime;

        // Priorité à futureSession, sinon currentSession
        if (this.sessionManager.futureSession &&
            this.sessionManager.futureSession.date &&
            this.sessionManager.futureSession.time) {
            formattedDate = this.sessionManager.futureSession.date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            sessionTime = this.sessionManager.futureSession.time;
        } else if (this.sessionManager.currentSession &&
            this.sessionManager.currentSession.date &&
            this.sessionManager.currentSession.time) {
            formattedDate = this.sessionManager.currentSession.date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            sessionTime = this.sessionManager.currentSession.time;
        } else {
            throw new Error('Aucune session n\'est planifiée');
        }

        await channel.send({
            content: `<@&${config.gameRoleId}> *Fait tinter une cloche de temple avec grâce*\n\nUne session est confirmée pour le ${formattedDate} à ${sessionTime} !\nRetrouvez-vous dans le salon vocal <#${config.gameVoiceChannelId}>.`
        });
    }

    async handleError(channel, error) {
        if (channel) {
            await channel.send({
                content: `*Médite sur une perturbation cosmique*\nUne erreur est survenue lors de la création de l\'événement...\nErreur: ${error.message}`
            });
        }
        throw error;
    }
}

module.exports = EventManager;