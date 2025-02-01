const { ActivityType } = require('discord.js');

function setupDiscordHeartbeat(client) {
    const zenStatuses = [
        { name: 'médite sur l\'harmonie', type: ActivityType.Custom },
        { name: 'le flux du destin', type: ActivityType.Watching },
        { name: 'l\'art du planning', type: ActivityType.Listening },
        { name: 'faire peur à Megumi', type: ActivityType.Playing },
        { name: 'l\'art du sarcasme zen', type: ActivityType.Competing },
        { name: 'Rituel de Mao ou invasion de rat ?', type: ActivityType.Playing },
        { name: 'Fait tourner la roue Karmique', type: ActivityType.Custom },
        { name: 'Pense avoir trouvé un rocher plus solide que Benkei', type: ActivityType.Custom },
    ];

    function updateStatus() {
        const status = zenStatuses[Math.floor(Math.random() * zenStatuses.length)];

        client.user.setActivity(status.name, {
            type: status.type
        });
    }

    // Mettre à jour le statut toutes les heures
    const heartbeat = setInterval(updateStatus, 60 * 60 * 1000);

    // Première mise à jour immédiate
    updateStatus();

    // Retourner la fonction de nettoyage
    return () => clearInterval(heartbeat);
}

module.exports = setupDiscordHeartbeat;