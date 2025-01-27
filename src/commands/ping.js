const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Vérifie l\'harmonie des éléments avec Botohiko Kakita (j\'ai atteint l\'illumination juste pour ça)'),

    async execute(interaction) {
        const sassyResponses = [
            //passive-agressive
            '*Ajuste son hakama avec une élégance minimaliste* L\'illumination m\'a libéré des vêtements superflus... comme certains se libèrent de leurs engagements. 🦢',
            '*Médite torse nu sous une cascade* Le dépouillement matériel est une vertu... comme la ponctualité, paraît-il. 🦢',
            '*Trace des motifs dans le sable avec une grâce étudiée* Le vide mène à l\'illumination... comme votre agenda mène au néant. 🦢',

            // Sassy wisdom
            '*Fait tourner son mala avec dédain* Le détachement m\'a apporté la paix... et l\'art du sarcasme céleste. 🦢',
            '*Suspend sa position du lotus* Même les pierres bougent plus que notre planning de jeu. 🦢',
            '*Ouvre un œil illuminé* J\'ai transcendé ma diégèse pour devenir le rappel incarné... Quelle élévation spirituelle inattendue. 🦢',

            // Zen
            '*Aligne ses chakras avec une précision passive-agressive* L\'harmonie intérieure est plus facile à atteindre qu\'une session régulière. 🦢',
            '*Psalmodie un mantra* Oooooommmmm... Serait-ce le son de vos excuses qui approchent ? 🦢',
            '*Pratique une position de yoga avec une grâce aristocratique* La flexibilité du corps est admirable... celle de votre agenda, moins. 🦢',

            // Meta
            '*Atteint le satori momentané* Dans ma vision cosmique, j\'aperçois... ah non, toujours pas de date de prochaine session. 🦢',
            '*Contemple l\'infini avec un sourcil haussé* L\'illumination m\'a montré bien des mystères... sauf votre emploi du temps. 🦢',
            '*Équilibre les énergies avec sass* Le ki circule... contrairement aux informations de planning. 🦢'
        ];

        const randomResponse = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];

        // Ensure the interaction hasn't already been responded to
        if (interaction.deferred || interaction.replied) {
            console.log('Interaction already responded');
            return;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const latency = Date.now() - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            await interaction.editReply({
                content: `${randomResponse}\n\n*Consulte les fortunes, les augures numériques et forcément, l'esprit de la machine *\nTemps de réponse : ${latency}ms\nHarmonie des serveurs : ${apiLatency}ms`
            });
        } catch (error) {
            console.error('Error in ping command:', error);
            try {
                await interaction.reply({
                    content: 'Une erreur est survenue lors de l\'exécution de cette commande.',
                    ephemeral: true
                });
            } catch {}
        }
    }
};