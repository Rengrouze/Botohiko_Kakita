module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            // Si c'est une commande slash
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) return;
                await command.execute(interaction);
            }

            // Si c'est un bouton
            if (interaction.isButton()) {
                await client.reminderService.responseManager.handleResponse(interaction);
            }
        } catch (error) {
            console.error('Erreur lors du traitement de l\'interaction:', error);
            const response = '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...';

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: response, ephemeral: true });
            } else {
                await interaction.followUp({ content: response, ephemeral: true });
            }
        }
    }
};