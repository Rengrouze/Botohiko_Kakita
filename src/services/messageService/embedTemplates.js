const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/config');

class EmbedTemplates {
    static get defaultAuthor() {
        return {
            name: '🦢 Kakita Hirohiko - Moine de la Grue',
            iconURL: 'https://files.d20.io/images/382626549/qs-z2zBgerPiWwSzDRMUaw/med.jpg?1709334427'
        };
    }

    static createBaseEmbed() {
        return new EmbedBuilder()
            .setColor('#89CFF0')
            .setAuthor(this.defaultAuthor)
            .setTimestamp();
    }

    static daily() {
        return this.createBaseEmbed()
            .setDescription(config.getDailyQuestion())
            .setFooter({
                text: '« La voie de l\'harmonie passe par la régularité des sessions »'
            });
    }

    static futureSession(date, time) {
        return this.createBaseEmbed()
            .setTitle('Une session se profile à l\'horizon')
            .setDescription(`*Déroule un parchemin avec une grâce étudiée*\n\nNotre vénérable MJ propose une session le ${date} à ${time}.\n\n*Trace des augures dans l'air d'un geste élégant*\nLes astres vous seront-ils favorables ce jour-là ?`)
            .setFooter({
                text: '« La voie de l\'harmonie passe par la planification des sessions »'
            });
    }

    static sessionConfirmation(time) {
        return this.createBaseEmbed()
            .setTitle('Confirmation de la session')
            .setDescription(`*Consulte son rouleau de planification avec attention*\n\nUne session est prévue aujourd'hui à ${time}.\n\n*Arrange son hakama avec expectative*\nLes astres sont-ils toujours favorables à cette rencontre ?`)
            .setFooter({
                text: '« La sagesse nous enseigne parfois la vertu du report »'
            });
    }

    static sessionStatus(date, time, responsesList) {
        return this.createBaseEmbed()
            .setTitle('État des disponibilités')
            .setDescription(`*Consulte son registre avec une attention méticuleuse*\n\nVoici l'état actuel des disponibilités pour la session du ${date} à ${time}:\n\n${responsesList}\n\n*Ajuste ses lunettes de lecture avec élégance*\nLes disciples peuvent modifier leur réponse avec les boutons ci-dessous.`)
            .setFooter({
                text: '« La flexibilité est la marque d\'un esprit éclairé »'
            });
    }

    static playerNotification(time) {
        return this.createBaseEmbed()
            .setTitle('Session de jeu potentielle')
            .setDescription(`*Ajuste son hakama avec une grâce étudiée*\n\nIl semblerait que notre vénérable MJ soit disponible aujourd'hui à partir de ${time}.\n\n*Contemple le vide avec un sourire énigmatique*\nPeut-être les astres s'aligneront-ils pour une session... ?`);
    }
    static futureSessionConfirmation(date, time) {
        return this.createBaseEmbed()
            .setTitle('Confirmation de la session planifiée')
            .setDescription(`*Consulte son calendrier avec attention*\n\nUne session est planifiée pour le ${date} à ${time}.\n\n*Ajuste son hakama avec expectative*\nConfirmez-vous toujours votre disponibilité pour ce jour ?`)
            .setFooter({
                text: '« La prévoyance est la marque d\'un esprit éclairé »'
            });
    }
    static dailyFutureConfirmation(date, time) {
        return this.createBaseEmbed()
            .setTitle('Confirmation de disponibilité')
            .setDescription(`*Consulte son rouleau de planification avec attention*\n\nUne session est prévue pour le ${date} à ${time}.\n\n*Arrange son hakama avec expectative*\nÊtes-vous toujours disponible pour ce jour ?`)
            .setFooter({
                text: '« La prudence nous invite à vérifier régulièrement nos engagements »'
            });
    }

    static finalConfirmation(date, time) {
        return this.createBaseEmbed()
            .setTitle('Confirmation finale de la session')
            .setDescription(`*Déroule un parchemin avec solennité*\n\nLa session est prévue aujourd'hui à ${time}.\n\n*S'incline respectueusement*\nConfirmez-vous votre présence ?`)
            .setFooter({
                text: '« Le moment de vérité approche »'
            });
    }
}

module.exports = EmbedTemplates;