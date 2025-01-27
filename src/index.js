const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

// Configuration du serveur Express
const app = express();
const port = process.env.PORT || 10000;

// Route simple pour satisfaire Render
app.get('/', (req, res) => {
    res.send('Botohiko Kakita est en service!');
});

// Démarrage du serveur Express
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur Express démarré sur le port ${port}`);
});

// Configuration du client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.MessageContent
    ]
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Chargement des événements
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Gestion des erreurs
process.on('unhandledRejection', error => {
    console.error('Erreur non gérée:', error);
});

client.login(config.token);