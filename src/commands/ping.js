const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérifie l\'harmonie des éléments avec Botohiko Kakita (j\'ai atteint l\'illumination juste pour ça)'),

    async execute(interaction) {
        const sent = await interaction.reply({
            content: '*Interrompt sa méditation avec une grâce calculée...*',
            ephemeral: true,
            fetchReply: true
        });

        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        // Collection de réponses sassies d'un moine illuminé
        const sassyResponses = [
            // Méditations passives-agressives
            '*Ajuste son hakama avec une élégance minimaliste* L\'illumination m\'a libéré des vêtements superflus... comme certains se libèrent de leurs engagements. 🦢',
            '*Médite torse nu sous une cascade* Le dépouillement matériel est une vertu... comme la ponctualité, paraît-il. 🦢',
            '*Trace des motifs dans le sable avec une grâce étudiée* Le vide mène à l\'illumination... comme votre agenda mène au néant. 🦢',

            // Sagesse sass
            '*Fait tourner son mala avec dédain* Le détachement m\'a apporté la paix... et l\'art du sarcasme céleste. 🦢',
            '*Suspend sa position du lotus* Même les pierres bougent plus que notre planning de jeu. 🦢',
            '*Ouvre un œil illuminé* J\'ai transcendé ma diégèse pour devenir le rappel incarné... Quelle élévation spirituelle inattendue. 🦢',

            // Piques zen
            '*Aligne ses chakras avec une précision passive-agressive* L\'harmonie intérieure est plus facile à atteindre qu\'une session régulière. 🦢',
            '*Psalmodie un mantra* Oooooommmmm... Serait-ce le son de vos excuses qui approchent ? 🦢',
            '*Pratique une position de yoga avec une grâce aristocratique* La flexibilité du corps est admirable... celle de votre agenda, moins. 🦢',

            // Illumination meta
            '*Atteint le satori momentané* Dans ma vision cosmique, j\'aperçois... ah non, toujours pas de date de prochaine session. 🦢',
            '*Contemple l\'infini avec un sourcil haussé* L\'illumination m\'a montré bien des mystères... sauf votre emploi du temps. 🦢',
            '*Équilibre les énergies avec sass* Le ki circule... contrairement aux informations de planning. 🦢'
        ];

        // Sélection aléatoire d'une réponse
        const randomResponse = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];

        await interaction.editReply({
            content: `${randomResponse}\n\n*Consulte les fortunes, les augures numériques et forcément, l'esprit de la machine *\nTemps de réponse : ${latency}ms\nHarmonie des serveurs : ${apiLatency}ms`,
            ephemeral: true
        });
    }
};