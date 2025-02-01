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
    scheduleTime: '0 8 * * *', // 9 AM every day

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
        ],
        // Réponses quand le MJ essaie d'utiliser la commande roast
        mjSelfRoastResponses: [
            "*Médite sur l'ironie de la situation* Plutôt que de chercher à vous insulter vous-même, trouvez du temps pour des sessions ou pour prendre conscience de vos privilèges... 🦢",
            "*Contemple le paradoxe avec amusement* L'auto-critique est une vertu, mais pas autant que la ponctualité... 🦢",
            "*Arrange son hakama avec une ironie palpable* Votre talent pour l'auto-dérision serait mieux utilisé dans la planification de sessions... 🦢",
            "*Fait tinter une cloche de sagesse* L'autocritique est le début de la sagesse, mais une session régulière serait un meilleur commencement... 🦢",
            "*Consulte les augures avec perplexité* Les Fortunes suggèrent que votre énergie serait mieux investie dans l'organisation... 🦢",
            "*Transcende momentanément la situation* Chercher à vous roast vous-même ne compensera pas l'absence de session... 🦢"
        ],

        roastResponses: [
            // Absence et Communication
            "*Consulte sa boîte aux lettres vide* Le silence de <@TARGET_USER_ID> est plus profond que ma méditation... 🦢",
            "*Étudie les techniques de communication ancestrales* Même les signaux de fumée seraient plus efficaces que vos updates de planning, <@TARGET_USER_ID>... 🦢",
            "*Attend un signe des cieux* Les prophéties sont plus claires que vos intentions de session, <@TARGET_USER_ID>... 🦢",
            "*Observe les mouvements des nuages* Plus réguliers que vos messages de planification, <@TARGET_USER_ID>... 🦢",
            "*Médite sur le concept du vide* Votre silence nous rapproche de l'illumination, <@TARGET_USER_ID>... Mais nous préférerions une date de session. 🦢",
            "*Écoute le son d'une main qui applaudit* Plus audible que vos réponses aux messages, <@TARGET_USER_ID>... 🦢",
            "*Contemple son téléphone en silence* Les notifications de <@TARGET_USER_ID> sont comme l'éveil : rares et inattendues... 🦢",
            "*Déroule le parchemin des messages non lus* Plus court que celui de vos absences, <@TARGET_USER_ID>... 🦢",
            "*Pratique l'art du pigeon voyageur* Même eux auraient plus de succès à vous joindre, <@TARGET_USER_ID>... 🦢",
            "*Étudie les techniques de divination* Plus fiables que vos confirmations de session, <@TARGET_USER_ID>... 🦢",
            "*Consulte la position des astres* Plus prévisible que votre planning, <@TARGET_USER_ID>... 🦢",
            "*Médite sur les mystères de l'univers* Moins mystérieux que vos absences prolongées, <@TARGET_USER_ID>... 🦢",
            "*Déchiffre d'anciens manuscrits* Plus faciles à comprendre que vos explications d'absence, <@TARGET_USER_ID>... 🦢",
            "*Contemple le vol des oiseaux migrateurs* Leur retour est plus prévisible que le vôtre, <@TARGET_USER_ID>... 🦢",

            // Culot et Audace
            "*Renverse délicatement son thé* L'audace de <@TARGET_USER_ID> qui propose une session après trois semaines de silence... Même les Fortunes en restent muettes. 🦢",
            "*Médite sur l'impermanence* Le culot de <@TARGET_USER_ID> est aussi grand que son agenda est vide... Les voies de l'harmonie sont vraiment impénétrables. 🦢",
            "*Arrange ses soutras avec une précision étudiée* <@TARGET_USER_ID> a plus de culot que le Bouddha n'a de sagesse... Et ce n'est pas peu dire. 🦢",
            "*Contemple une feuille qui tombe* Votre audace de demander si nous sommes disponibles ce soir, <@TARGET_USER_ID>, fait rougir jusqu'aux esprits des ancêtres... 🦢",
            "*Aligne ses chakras avec consternation* L'audace de <@TARGET_USER_ID> qui demande pourquoi nous ne sommes pas plus réactifs... La réponse se perd dans le karma. 🦢",
            "*Trace des augures dans l'air* Le culot cosmique de <@TARGET_USER_ID> qui suggère que nous manquons d'organisation... Les kamis en perdent leur harmonie. 🦢",
            "*Fait tinter une cloche de temple* L'écho de votre audace résonne moins longtemps que vos absences, <@TARGET_USER_ID>... 🦢",
            "*Polit son miroir de méditation* Le reflet de votre culot, <@TARGET_USER_ID>, éclipserait presque celui de vos reports de dernière minute... 🦢",
            "*Consulte les oracles avec stupéfaction* Les augures me parlent d'un MJ qui ose suggérer que nous manquons de motivation... N'est-ce pas, <@TARGET_USER_ID> ? 🦢",
            "*Disperse des pétales de cerisier* Aussi nombreux que les excuses de <@TARGET_USER_ID>, mais moins créatifs... 🦢",

            // Trauma et Violence
            "*Médite sur les cicatrices de nos personnages* La thérapie de groupe coûterait moins cher que vos sessions, <@TARGET_USER_ID>... 🦢",
            "*Contemple les archives des batailles passées* Le PTSD de nos personnages rivalise avec notre anxiété quand <@TARGET_USER_ID> sourit... 🦢",
            "*Déroule un parchemin des traumatismes* Même les kamis tremblent devant le sourire sadique de <@TARGET_USER_ID>... 🦢",
            "*Compte les points de blessure* Nos personnages ont plus de cicatrices que <@TARGET_USER_ID> n'a d'excuses... Et ce n'est pas peu dire. 🦢",
            "*Consulte le registre des morts évitées* Le nombre de jets de survie commence à rivaliser avec vos reports de session, <@TARGET_USER_ID>... 🦢",
            "*Médite sur la nature du danger* Les probabilités de survie de nos personnages sont plus élevées que celles d'une session régulière avec <@TARGET_USER_ID>... 🦢",
            "*Brûle de l'encens pour les personnages tombés* Même les Fortunes s'inquiètent de vos plans, <@TARGET_USER_ID>... 🦢",
            "*Arrange des amulettes de protection* Si seulement elles protégeaient aussi contre vos scénarios, <@TARGET_USER_ID>... 🦢",

            // Taquin et Provocateur
            "*Contemple un bug dans le code* L'audace de <@TARGET_USER_ID> qui teste les limites du bot rivalise avec celle de tester les limites de notre patience... 🦢",
            "*Débogue avec une sérénité forcée* Comme le code, la patience a ses limites, <@TARGET_USER_ID>... Mais vous semblez ignorer les deux. 🦢",
            "*Médite sur la nature des exceptions non gérées* Votre talent pour trouver les failles rivalise avec celui d'esquiver les sessions, <@TARGET_USER_ID>... 🦢",
            "*Corrige le karma du code* Les bugs sont plus prévisibles que vos sessions, <@TARGET_USER_ID>... Et plus faciles à corriger. 🦢",
            "*Aligne les chakras des variables* L'harmonie du code est perturbée par votre volonté de chaos, <@TARGET_USER_ID>... 🦢",
            "*Parse les erreurs avec une grâce étudiée* Le culot de rejeter la faute sur le code... Les voies de la mauvaise foi sont impénétrables, <@TARGET_USER_ID>. 🦢",
            "*Optimise les performances avec une patience zen* Si seulement vous mettiez autant d'énergie à planifier les sessions, <@TARGET_USER_ID>... 🦢",

            // Sagesse et Méditation
            "*Émerge d'une profonde méditation* Les voies de la sagesse m'ont révélé que <@TARGET_USER_ID> médite plus souvent sur son téléphone que sur nos sessions... 🦢",
            "*Arrange son jardin zen* Comme ces graviers, vos promesses de sessions s'éparpillent au vent, <@TARGET_USER_ID>... 🦢",
            "*Verse du thé avec une précision étudiée* Comme ce thé, la patience des joueurs finira par déborder, <@TARGET_USER_ID>... 🦢",
            "*Médite sous un cerisier* Les fleurs sont éphémères... Comme vos promesses de sessions régulières, <@TARGET_USER_ID>. 🦢",
            "*Contemple un koan* Si un MJ annule dans le vide, fait-il vraiment du bruit ? Demandons à <@TARGET_USER_ID>... 🦢",
            "*Fait tourner son mala avec une grâce étudiée* Le karma nous enseigne que <@TARGET_USER_ID> reviendra peut-être en gastéropode dans sa prochaine vie... Probablement à cause du rythme des sessions. 🦢",

            // Arts Martiaux et Combat
            "*Pratique ses katas avec grâce* Votre talent pour éviter les sessions, <@TARGET_USER_ID>, rivalise avec mon agilité au combat... 🦢",
            "*Rengaine son katana avec une lenteur délibérée* La voie du bushido enseigne l'honneur... Pas l'art d'esquiver les sessions, <@TARGET_USER_ID>. 🦢",
            "*Polit son sabre avec une attention méticuleuse* Plus affûté que les excuses de <@TARGET_USER_ID>... Difficile. 🦢"
        ],
        imminentGifs: [
            "https://media.giphy.com/media/QBd2kLB5qDmysEXre9/giphy.gif",  // Mr Bean qui regarde sa montre
            "https://media.giphy.com/media/FoH28ucxZFJZu/giphy.gif",        // Titanic attente dramatique
            "https://media.giphy.com/media/jZAwc1FZ4TednLkWwu/giphy.gif",   // LeBron "Dame Time"
            "https://media.giphy.com/media/PCvkgunX9ZbEEyfTQH/giphy.gif",   // Ghost "Where you at"
            "https://media.giphy.com/media/lP4jmO461gq9uLzzYc/giphy.gif",   // Still waiting
            "https://media.giphy.com/media/QhjR3MG9ZFfjB6BtIZ/giphy.gif",   // I'm still waiting
            "https://media.giphy.com/media/26his5i9YJTqsqCyY/giphy.gif",    // Desperate housewives waiting
            "https://media.giphy.com/media/229Pljon180JF07BaX/giphy.gif",   // Late night waiting
            "https://media.giphy.com/media/ZR8teuiCs3AkSkzjnG/giphy.gif",   // Squid Game time passing
            "https://media.giphy.com/media/BDQmMy3ZM8sgRNFkhe/giphy.gif",   // Big Bird waiting
            "https://media.giphy.com/media/ZXKZWB13D6gFO/giphy.gif"         // Alice in Wonderland bored
        ],

        imminentMessages: [
            "*Consulte le sablier avec insistance* Il semblerait que l'heure approche... ou pas ? 🦢",
            "*Médite de façon de plus en plus audible* Le temps file, comme nos espoirs de session... 🦢",
            "*Fait tinter sa cloche de temple avec une régularité passive-agressive* Les disciples attendent... 🦢",
            "*Arrange son hakama pour la énième fois* L'impatience n'est pas zen... Mais là quand même... 🦢",
            "*Compte les grains de son mala* Un grain, une minute de retard... J'en suis au troisième tour... 🦢",
            "*Contemple le vide de la salle* Le néant est moins profond que notre attente... 🦢",
            "*Pratique la calligraphie* Je écris 'patience' depuis une heure... 🦢",
            "*Aligne des pierres zen* Comme nos messages sans réponse... 🦢",
            "*Observe la course du soleil* Même lui avance plus vite que cette session... 🦢",
            "*Prépare son quinzième thé* L'eau bout plus vite que la session démarre... 🦢",
            "*Arbore un sourire taquin* C'est imminent... 🦢"
        ],

        imminentStart: "*S'incline avec une détermination inquiétante* Le compte à rebours de votre conscience commence... 🦢",
        imminentStop: "*Range son sablier avec une satisfaction évidente* La méditation intensive a porté ses fruits... 🦢",
        imminentAlreadyActive: "*Hausse un sourcil perplexe* La méditation intensive est déjà en cours... Votre culpabilité est-elle si grande ? 🦢",
        imminentNotActive: "*Médite sur le vide de la requête* Il n'y a pas de méditation intensive à arrêter... 🦢"

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
    getRandomRoast(){
        return this.messages.roastResponses[Math.floor(Math.random() * this.messages.roastResponses.length)];
    },
    getRandomMJSelfRoast(){
        return this.messages.mjSelfRoastResponses[Math.floor(Math.random() * this.messages.mjSelfRoastResponses.length)];
    },
    getRandomImminentMessage() {
        const message = this.messages.imminentMessages[Math.floor(Math.random() * this.messages.imminentMessages.length)];
        const gif = this.messages.imminentGifs[Math.floor(Math.random() * this.messages.imminentGifs.length)];
        return { message, gif };
    },

    // Helper pour formater les messages avec des variables
    formatMessage(message, variables) {
        return message.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
    }
};