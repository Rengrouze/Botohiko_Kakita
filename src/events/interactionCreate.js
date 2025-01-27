module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Si c'est une commande slash
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                    ephemeral: true
                });
            }
        }

        // Si c'est une interaction avec un bouton (pour notre système de rappel)
        if (interaction.isButton()) {
            try {
                await client.reminderService.handleResponse(interaction);
            } catch (error) {
                console.error('Erreur lors du traitement de l\'interaction:', error);
                await interaction.reply({
                    content: 'Une erreur est survenue lors du traitement de votre réponse.',
                    ephemeral: true
                });
            }
        }
    }
};