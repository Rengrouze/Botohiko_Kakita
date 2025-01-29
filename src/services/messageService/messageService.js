const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const EmbedTemplates = require('./embedTemplates');
const ButtonTemplates = require('./buttonTemplates');
const config = require('../../../config/config');

class MessageService {
    createTimeModal() {
        const modal = new ModalBuilder()
            .setCustomId('timeModal')
            .setTitle('À partir de quelle heure ?');

        const timeInput = new TextInputBuilder()
            .setCustomId('timeInput')
            .setLabel('Heure de disponibilité (format HH:MM)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('14:00')
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(5);

        modal.addComponents(new ActionRowBuilder().addComponents(timeInput));
        return modal;
    }

    async sendDailyMessage(user) {
        const embed = EmbedTemplates.daily();
        const buttons = ButtonTemplates.dailyChoice();
        const message = await user.send({ embeds: [embed], components: [buttons] });

        // Désactiver les boutons à la fin de la journée
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const timeUntilEndOfDay = endOfDay.getTime() - Date.now();

        setTimeout(async () => {
            try {
                await message.edit({
                    components: [ButtonTemplates.dailyChoice(true)]
                });
            } catch (error) {
                console.error('Erreur lors de la désactivation des boutons:', error);
            }
        }, timeUntilEndOfDay);

        return message;
    }

    async sendPlayerNotification(player, time) {
        const embed = EmbedTemplates.playerNotification(time);
        const buttons = ButtonTemplates.playerResponse();
        const message = await player.send({ embeds: [embed], components: [buttons] });

        setTimeout(async () => {
            try {
                await message.edit({
                    components: [ButtonTemplates.playerResponse(true)]
                });
            } catch (error) {
                console.error('Erreur lors de la désactivation des boutons:', error);
            }
        }, config.responseTimeout);

        return message;
    }

    async sendFutureSessionRequest(user, date, time) {
        const embed = EmbedTemplates.futureSession(date, time);
        const buttons = ButtonTemplates.futureSession();
        const message = await user.send({ embeds: [embed], components: [buttons] });

        // Désactiver les boutons après un certain temps
        setTimeout(async () => {
            try {
                await message.edit({
                    components: [ButtonTemplates.futureSession(true)]
                });
            } catch (error) {
                console.error('Erreur lors de la désactivation des boutons:', error);
            }
        }, config.responseTimeout || (24 * 60 * 60 * 1000)); // Par défaut 24h

        return message;
    }

    async updateSessionStatus(channel, date, time, responses) {
        const statusList = this.formatResponsesList(responses);
        const embed = EmbedTemplates.sessionStatus(date, time, statusList);

        // Vérifier si tous les joueurs ont répondu
        const allResponded = responses.size === config.playerIds.length;

        // Choisir les boutons en fonction du statut des réponses
        const buttons = allResponded
            ? ButtonTemplates.futureUpdate(true)
            : ButtonTemplates.futureUpdate();

        return await channel.send({ embeds: [embed], components: [buttons] });
    }

    formatResponsesList(responses) {
        const statusEmoji = { yes: '✅', no: '❌', maybe: '❓' };
        return Array.from(responses.entries())
            .map(([playerId, status]) => `<@${playerId}>: ${statusEmoji[status]}`)
            .join('\n');
    }
    createSessionConfirmationEmbed(date, time) {
        return EmbedTemplates.dailyFutureConfirmation(date, time);
    }
}

module.exports = new MessageService();