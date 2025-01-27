# Botohiko Kakita - Game Session Scheduler Bot 🦢

[English](#english) | [Français](#français)

---

## English

### Description
Botohiko Kakita is a Discord bot designed to elegantly solve the eternal problem of scheduling tabletop RPG sessions. Taking on the persona of a passive-aggressive Crane Clan monk from Legend of the Five Rings, the bot handles scheduling with style and sass.

### Features
- **Daily Check-ins**: Automatically sends a daily message to the GM asking about session availability
- **Elegant Notifications**: Notifies players when the GM is available
- **Session Management**:
    - Collects player responses
    - Creates a scheduled event when everyone is available
    - Manages voice channel assignments
- **Sass Included**: Every interaction is flavored with Crane Clan elegance and passive-aggressive wisdom

### Setup
1. Create a `.env` file with the following variables:
```env
# Bot Configuration
TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here
GUILD_ID=your_server_id_here

# User Configuration
TARGET_USER_ID=your_gm_id_here
PLAYER_IDS=player1_id,player2_id,player3_id

# Channel Configuration
NOTIFICATION_CHANNEL_ID=your_notification_channel_id_here
GAME_VOICE_CHANNEL_ID=your_voice_channel_id_here
```

2. Install dependencies:
```bash
npm install
```

3. Deploy commands:
```bash
npm run deploy
```

4. Start the bot:
```bash
npm start
```

### Commands
- `/ping` - Check bot's response time with appropriate Crane-style sass
- `/testreminder` - Test the daily reminder system

### Dependencies
- discord.js
- node-cron
- dotenv

### Technical Requirements
- Node.js 16.9.0 or higher
- Discord Developer Portal Application with bot token
- Proper bot permissions (Manage Events, Send Messages, etc.)

---

## Français

### Description
Botohiko Kakita est un bot Discord conçu pour résoudre avec élégance l'éternel problème de la planification des sessions de jeu de rôle. Adoptant la personnalité d'un moine du Clan de la Grue passive-agressif de Legend of the Five Rings, le bot gère la planification avec style et sass.

### Fonctionnalités
- **Vérifications Quotidiennes** : Envoie automatiquement un message quotidien au MJ pour connaître ses disponibilités
- **Notifications Élégantes** : Informe les joueurs lorsque le MJ est disponible
- **Gestion des Sessions** :
    - Collecte les réponses des joueurs
    - Crée un événement programmé lorsque tout le monde est disponible
    - Gère l'attribution des salons vocaux
- **Sass Inclus** : Chaque interaction est agrémentée d'élégance Grue et de sagesse passive-agressive

### Installation
1. Créer un fichier `.env` avec les variables suivantes :
```env
# Configuration du Bot
TOKEN=votre_token_bot_ici
CLIENT_ID=votre_client_id_ici
GUILD_ID=id_de_votre_serveur

# Configuration Utilisateur
TARGET_USER_ID=id_du_mj
PLAYER_IDS=id_joueur1,id_joueur2,id_joueur3

# Configuration des Canaux
NOTIFICATION_CHANNEL_ID=id_canal_notifications
GAME_VOICE_CHANNEL_ID=id_canal_vocal
```

2. Installer les dépendances :
```bash
npm install
```

3. Déployer les commandes :
```bash
npm run deploy
```

4. Démarrer le bot :
```bash
npm start
```

### Commandes
- `/ping` - Vérifier le temps de réponse du bot avec le sass approprié du style Grue
- `/testreminder` - Tester le système de rappel quotidien

### Dépendances
- discord.js
- node-cron
- dotenv

### Prérequis Techniques
- Node.js 16.9.0 ou supérieur
- Application Discord Developer Portal avec token bot
- Permissions bot appropriées (Gérer les Événements, Envoyer des Messages, créer des évènements et associés etc.)

---

## License
MIT License

## Credits
Created with 🦢 elegance by [Rengrouze | Kakita Hirohiko](https://github.com/Rengrouze)