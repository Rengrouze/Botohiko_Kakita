const express = require('express');
const axios = require('axios');

function createExpressServer(port = 10000) {
    const app = express();

    // Route simple pour satisfaire Render
    app.get('/', (req, res) => {
        res.send('Botohiko Kakita est en service!');
    });

    const server = app.listen(port, '0.0.0.0', () => {
        console.log(`Serveur Express démarré sur le port ${port}`);
    });

    return server;
}

async function pingExternalService() {
    try {
        const pingUrl = process.env.KEEPALIVE_URL;
        if (pingUrl) {
            await axios.get(pingUrl);
            console.log('Keepalive ping envoyé avec succès');
        }
    } catch (error) {
        console.error('Échec du ping keepalive:', error.message);
    }
}

function setupServerHeartbeat(server) {
    // Ping interne toutes les 10 minutes
    setInterval(pingExternalService, 10 * 60 * 1000);

    // Vérifier les connexions actives toutes les 5 minutes
    const heartbeatInterval = setInterval(() => {
        server.getConnections((err, connections) => {
            if (err) {
                console.error('Erreur lors du comptage des connexions:', err);
                return;
            }
            console.log(`Connexions actives: ${connections}`);
        });
    }, 5 * 60 * 1000);

    return () => clearInterval(heartbeatInterval);
}

module.exports = {
    createExpressServer,
    pingExternalService,
    setupServerHeartbeat
};