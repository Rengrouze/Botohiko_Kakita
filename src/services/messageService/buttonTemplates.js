const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class ButtonTemplates {
    static createButton(customId, label, style, disabled = false) {
        return new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(label)
            .setStyle(style)
            .setDisabled(disabled);
    }

    static createButtonRow(...buttons) {
        return new ActionRowBuilder().addComponents(...buttons);
    }

    static dailyChoice(disabled = false) {
        return this.createButtonRow(
            this.createButton('yes', 'Oui', ButtonStyle.Success, disabled),
            this.createButton('no', 'Non', ButtonStyle.Danger, disabled)
        );
    }

    static playerResponse(disabled = false) {
        return this.createButtonRow(
            this.createButton('player_yes', 'Je suis disponible', ButtonStyle.Success, disabled),
            this.createButton('player_no', 'Je ne suis pas disponible', ButtonStyle.Danger, disabled)
        );
    }

    static futureSession(disabled = false) {
        return this.createButtonRow(
            this.createButton('future_yes', 'Je devrais être disponible', ButtonStyle.Success, disabled),
            this.createButton('future_no', 'Je ne serai pas disponible', ButtonStyle.Danger, disabled),
            this.createButton('future_maybe', 'Je ne sais pas encore', ButtonStyle.Secondary, disabled)
        );
    }

    static sessionConfirmation(disabled = false) {
        return this.createButtonRow(
            this.createButton('confirm_session', 'Maintenir la session', ButtonStyle.Success, disabled),
            this.createButton('cancel_session', 'Annuler la session', ButtonStyle.Danger, disabled)
        );
    }

    static futureUpdate(disabled = false) {
        return this.createButtonRow(
            this.createButton('update_yes', 'Finalement je serai là', ButtonStyle.Success, disabled),
            this.createButton('update_no', 'Finalement je ne pourrai pas', ButtonStyle.Danger, disabled)
        );
    }

    static futureConfirmation(disabled = false) {
        return this.createButtonRow(
            this.createButton('future_confirm', 'Je serai là', ButtonStyle.Success, disabled),
            this.createButton('future_cancel', 'Je ne pourrai pas', ButtonStyle.Danger, disabled),
            this.createButton('future_unsure', 'Je dois vérifier', ButtonStyle.Secondary, disabled)
        );
    }

    static dailyConfirmation(disabled = false) {
        return this.createButtonRow(
            this.createButton('daily_confirm', 'Je confirme', ButtonStyle.Success, disabled),
            this.createButton('daily_cancel', 'Je dois annuler', ButtonStyle.Danger, disabled)
        );
    }
}

module.exports = ButtonTemplates;