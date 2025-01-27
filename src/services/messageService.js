const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const config = require('../../config/config');

class MessageService {
    createDailyEmbed() {
        console.log('Création de l\'embed quotidien...');
        return new EmbedBuilder()
            .setColor('#89CFF0')
            .setAuthor({
                name: '🦢 Kakita Hirohiko - Moine de la Grue',
                iconURL: 'https://cdn.discordapp.com/avatars/1234/crane_mon.png'
            })
            .setDescription(config.getDailyQuestion())
            .setFooter({
                text: '« La voie de l\'harmonie passe par la régularité des sessions »'
            })
            .setTimestamp();
    }

    createButtons() {
        console.log('Création des boutons de réponse...');
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Danger)
            );
    }

    createTimeModal() {
        console.log('Création du modal de saisie de l\'heure...');
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

        const actionRow = new ActionRowBuilder().addComponents(timeInput);
        modal.addComponents(actionRow);

        return modal;
    }

    createPlayersNotificationEmbed(time) {
        console.log(`Création de l'embed de notification des joueurs pour ${time}.`);

        return new EmbedBuilder()
            .setColor('#89CFF0')
            .setTitle('Session de jeu potentielle')
            .setDescription(`*Ajuste son hakama avec une grâce étudiée*\n\nIl semblerait que notre vénérable MJ soit disponible aujourd'hui à partir de ${time}.\n\n*Contemple le vide avec un sourire énigmatique*\nPeut-être les astres s'aligneront-ils pour une session... ?`)
            .setTimestamp();
    }

    createPlayerResponseButtons() {
        console.log('Création des boutons de réponse des joueurs...');
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('player_yes')
                    .setLabel('Je suis disponible')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('player_no')
                    .setLabel('Je ne suis pas disponible')
                    .setStyle(ButtonStyle.Danger)
            );
    }

    async sendDailyMessage(user) {
        try {
            console.log(`Envoi du message quotidien à l'utilisateur ${user.username}...`);
            const embed = this.createDailyEmbed();
            const buttons = this.createButtons();

            const message = await user.send({
                embeds: [embed],
                components: [buttons]
            });
            console.log('Message quotidien envoyé avec succès.');

            // Désactiver les boutons à la fin de la journée
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const timeUntilEndOfDay = endOfDay.getTime() - Date.now();

            setTimeout(async () => {
                try {
                    const disabledButtons = this.createDisabledButtons();
                    await message.edit({ components: [disabledButtons] });
                } catch (error) {
                    console.error('Erreur lors de la désactivation des boutons:', error);
                }
            }, timeUntilEndOfDay);

            return message;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            throw error;
        }
    }

    async sendPlayerNotification(player, time) {
        try {
            console.log(`Envoi de la notification au joueur ${player.tag} pour une session à partir de ${time}.`);

            if (!player) {
                console.error('Joueur non défini lors de l\'envoi de la notification');
                return;
            }

            const embed = this.createPlayersNotificationEmbed(time);
            const buttons = this.createPlayerResponseButtons();

            const message = await player.send({
                embeds: [embed],
                components: [buttons]
            });

            // Désactiver les boutons après 24h
            setTimeout(async () => {
                try {
                    const disabledButtons = this.createDisabledButtons();
                    await message.edit({ components: [disabledButtons] });
                } catch (error) {
                    console.error('Erreur lors de la désactivation des boutons:', error);
                }
            }, config.responseTimeout);

            return message;
        } catch (error) {
            console.error(`Erreur lors de l'envoi de la notification au joueur ${player.tag}:`, error);
            throw error;
        }
    }

    createDisabledButtons() {
        console.log('Création des boutons désactivés...');
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Oui')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('Non')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );
    }

    createDisabledPlayerButtons() {
        console.log('Création des boutons de réponse joueur désactivés...');
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('player_yes')
                    .setLabel('Je suis disponible')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('player_no')
                    .setLabel('Je ne suis pas disponible')
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            );
    }
}

module.exports = new MessageService();