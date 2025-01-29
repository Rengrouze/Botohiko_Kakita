const Logger = require('./logger');

class ErrorHandler {
    static async handle(error, service, method, interaction = null) {
        Logger.error(service, method, error);

        // Si on a une interaction Discord, on essaie de répondre à l'utilisateur
        if (interaction) {
            try {
                const errorMessage = '*Médite sur une perturbation cosmique*\n' +
                    'Une erreur est survenue dans l\'harmonie du code...';

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                } else {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                }
            } catch (replyError) {
                Logger.error(service, 'ErrorHandler.handle', replyError, {
                    context: 'Erreur lors de la réponse à l\'erreur originale'
                });
            }
        }

        // Selon le type d'erreur, on peut avoir différents comportements
        if (error.code === 'INTERACTION_ALREADY_REPLIED') {
            Logger.warn(service, method, 'Tentative de répondre à une interaction déjà traitée');
            return;
        }

        // On peut ajouter d'autres cas spécifiques ici
    }
}

module.exports = ErrorHandler;