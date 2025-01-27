require('dotenv').config();

module.exports = {
    // Bot Configuration
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,

    // User Configuration
    targetUserId: process.env.TARGET_USER_ID,
    playerIds: process.env.PLAYER_IDS.split(','),
    creatorId: process.env.CREATOR_ID,
    gameRoleId: process.env.GAME_ROLE_ID,

    // Channel Configuration
    notificationChannelId: process.env.NOTIFICATION_CHANNEL_ID,
    gameVoiceChannelId: process.env.GAME_VOICE_CHANNEL_ID,

    // Schedule Configuration
    scheduleTime: '0 9 * * *', // 9 AM every day

    // Message Configuration
    messages: {
        refusalResponses: [
            "*Médite intensément sur la nature du planning vide* Je vois... Le néant nous appelle à nouveau.",
            "*Arrange son hakama avec une déception parfaitement étudiée* Les voies de l'harmonie sont vraiment... impénétrables.",
            "*Soupire avec une élégance résignée* Une autre journée à contempler le vide de notre planning...",
            "*Fait tourner son mala avec une grâce passive-agressive* Le karma se souviendra de ceci.",
            "*Écrit un haiku dans l'air* 'Comme la rosée / Les espoirs de session fondent / Sous le soleil cruel'",
            "*Ajuste sa position de méditation* Je vais méditer sur la nature éphémère des opportunités de jeu.",
            "*Range son katana avec une lenteur délibérée* La voie du bushido nous enseigne aussi la patience... Beaucoup de patience.",
            "*Disperse des pétales de cerisier imaginaires* Aussi éphémères que nos sessions...",
            "*Consulte les augures* Ah... Les présages avaient prédit ce refus. Comme les 257 précédents.",
            "*Lisse son jardin zen avec une précision passive-agressive* Un autre motif dans le sable de nos reports..."
        ],
        errors: {
            wrongTimeFormat: '*Fronce les sourcils avec élégance*\nLe format de l\'heure doit être HH:MM. Vous pouvez réessayer en cliquant à nouveau sur le bouton.',
            pastTime: '*Médite sur les paradoxes temporels avec consternation*\nMême mon illumination ne me permet pas de remonter le temps... Proposez une heure future en cliquant à nouveau sur le bouton.',
            tooFarFuture: '*Contemple l\'horizon temporel avec perplexité*\nMême ma sagesse ne peut voir si loin dans le futur. Proposez une heure dans les 12 prochaines heures en cliquant à nouveau sur le bouton.',
            alreadyResponded: '*Hausse un sourcil désapprobateur*\nVous avez déjà fait connaître votre disponibilité...',
            unauthorized: '*Hausse un sourcil avec une élégance désapprobatrice*\nSeuls les initiés sont autorisés à répondre à cette question...',
            spamming: '*Médite sur la précipitation*\nLa patience est une vertu... Attendez quelques secondes avant de réessayer.',
            noSession: '*Médite sur une incohérence temporelle*\nIl semble qu\'aucune session ne soit actuellement planifiée...',
            timeout: '*Contemple le sablier vide*\nLe temps imparti pour les réponses est écoulé... La session est annulée.',
            sessionCancelled: '*Soupire avec une élégance résignée*\nLes astres ne sont pas alignés aujourd\'hui... Session annulée.',
            generalError: '*Médite sur une erreur inattendue*\nLes voies de l\'harmonie sont perturbées...'
        },
        success: {
            timeAccepted: '*Arrange son hakama avec satisfaction*\nExcellent, je vais informer les autres de votre disponibilité à partir de {time}.',
            playerAvailable: '*Incline légèrement la tête*\nVotre disponibilité est notée avec la plus grande attention.',
            playerUnavailable: '*Soupire avec une élégance résignée*\nLes voies du planning sont parfois impénétrables...',
            eventCreated: '*Fait tinter une cloche de temple avec grâce*\n\nUne session a été programmée pour {time} !\nRetrouvez-vous dans le salon vocal <#{channelId}>.'
        },
        dailyQuestions: [
            // Meditation theme
            "*Émerge d'une profonde méditation* Les voies du Vide m'ont révélé une question d'une importance capitale : envisageriez-vous une session aujourd'hui ? *reprend sa pose de lotus avec une grâce étudiée*",
            "*Ouvre un œil pendant sa méditation* Oh, quel heureux hasard... Je méditais justement sur la possibilité d'une session aujourd'hui. *sourit énigmatiquement*",
            "*Aligne ses chakras avec une précision passive-agressive* Les énergies cosmiques m'incitent à vous demander... Session ? *reprend sa méditation avec un soupir élégant*",

            // Martial arts theme
            "*Suspend son kata avec une grâce infinie* Dans ma quête de perfection martiale, une question me vient... Seriez-vous disponible pour diriger aujourd'hui ? *reprend sa position avec élégance*",
            "*Rengaine son katana avec une lenteur étudiée* La voie du sabre m'enseigne la patience... Mais pas trop. Session aujourd'hui ? *arrange son hakama*",
            "*Termine une série de mouvements d'arts martiaux* La discipline du corps et de l'esprit est importante... Comme la régularité des sessions. Des projets pour aujourd'hui ? *s'évente délicatement*",

            // Silk tongue of the crane
            "*Arrange son hakama minimaliste avec une élégance raffinée* Mon très cher MJ, les convenances m'obligent à m'enquérir de vos disponibilités du jour... *sourire énigmatique*",
            "*Verse du thé avec une grâce étudiée* Puisque le hasard nous réunit... Parlons planning, voulez-vous ? *sirote élégamment*",
            "*Déploie son éventail avec une lenteur calculée* Les rumeurs de la cour céleste parlent d'une possible session... Qu'en dites-vous ? *regard interrogateur parfaitement étudié*",

            // Enlightment
            "*Contemple l'infini avec un détachement étudié* Dans ma quête d'illumination, une vision m'est apparue... Celle d'une possible session aujourd'hui ? *hausse un sourcil mystique*",
            "*Atteint un état de satori momentané* Oh... Je vois... Je vois... Une table de jeu... Aujourd'hui ? *revient à la réalité avec grâce*",
            "*Médite sous une cascade imaginaire* L'eau m'a murmuré une question... Seriez-vous libre pour une session ? *s'ébroue avec élégance*",

            // Karma
            "*Fait tourner son mala avec une nonchalance étudiée* Le karma nous réunira-t-il pour une session aujourd'hui ? *sourire bienveillant légèrement moqueur*",
            "*Consulte les augures avec une concentration feinte* Les présages sont... intéressants. Une session serait-elle envisageable ? *range ses bâtonnets d'encens*",
            "*Trace des motifs dans le sable avec précision* Les lignes du destin suggèrent une possible session... Qu'en pensez-vous ? *efface les motifs d'un geste gracieux*",

            // Transcendence
            "*Transcende momentanément le plan matériel* Depuis les plans supérieurs, j'aperçois... une table de jeu ? Serait-ce pour aujourd'hui ? *redescend avec élégance*",
            "*Flotte légèrement au-dessus du sol* L'élévation spirituelle est importante... Comme les sessions régulières. Disponible ? *retombe avec grâce*",
            "*Apparaît dans un nuage de pétales de cerisier* Le temps est une illusion, mais les sessions sont bien réelles. Aujourd'hui ? *disperse les pétales d'un geste*",

            // Zen
            "*Contemple un koan sur le planning* Si un MJ est disponible dans le vide, fait-il du bruit ? Devrions-nous vérifier aujourd'hui ? *sourire énigmatique*",
            "*Arrange un jardin zen miniature* Comme ces graviers, nos emplois du temps pourraient s'harmoniser... Qu'en dites-vous ? *lisse le sable avec précision*",
            "*Médite sur le son d'une main qui applaudit* Le vide m'a parlé de disponibilités... Les vôtres, plus précisément ? *ouvre un œil interrogateur*",

            // Philosophy
            "*Déroule un parchemin de sagesse* La vraie question n'est pas 'pourquoi une session', mais 'pourquoi pas aujourd'hui' ? *range le parchemin avec grâce*",
            "*Écrit un haiku dans l'air* 'Session de jeu tant / Attendue comme la pluie / Viendra-t-elle enfin ?' *range son pinceau imaginaire*",
            "*Contemple une feuille qui tombe* Comme cette feuille, laissez-vous porter par le vent... Vers une table de jeu ? *rattrape la feuille avec élégance*",

            // Sassy
            "*Interrompt sa lévitation* Oh, vous êtes là ? Je méditais justement sur votre emploi du temps... *sourire innocent*",
            "*Pose son bol de thé avec un tintement parfaitement calculé* Les astres sont alignés... Votre agenda l'est-il ? *regard perçant*",
            "*Suspend son entraînement au sabre* La voie du bushido nous enseigne la régularité... Comme celle des sessions ? *rengaine avec style*",

            // Meta
            "*Brise le quatrième mur avec élégance* La transcendance m'a mené au-delà de ma diégèse pour vous poser cette question : session ? *réajuste la réalité*",
            "*Médite sur la nature même du roleplay* Si un personnage transcende sa réalité pour demander une session, est-ce du méta-jeu ? *sourire énigmatique*",
            "*Contemple les dés de la destinée* Ces instruments du hasard semblent propices... Une session aujourd'hui ? *fait disparaître les dés dans sa manche*",

            // direct
            "*Existe élégamment* Alors... Session ? *attend avec une patience passive-agressive*"
        ]
    },

    // Timeout Configuration
    responseTimeout: 24 * 60 * 60 * 1000, // 24 hours

    // Functions
    getDailyQuestion() {
        return this.messages.dailyQuestions[Math.floor(Math.random() * this.messages.dailyQuestions.length)];
    },

    getRandomRefusal() {
        return this.messages.refusalResponses[Math.floor(Math.random() * this.messages.refusalResponses.length)];
    },

    // Helper pour formater les messages avec des variables
    formatMessage(message, variables) {
        return message.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
    }
};