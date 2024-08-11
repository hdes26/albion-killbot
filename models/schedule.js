const cron = require('node-cron');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, REST } = require('discord.js');

const { dbConnection, dbDisconnect } = require("../database/config");
const { SERVERS } = require("../helpers/albion");
const { getGuilds, saveMembers, getMembers } = require("../services/guild.service");
const { guildMemberKillsById, getEvent, getLootValue, guildMemberDeathsById } = require('../ports/albion');
const { generateEventImage, generateInventoryImage } = require('../services/images.service');




class Schedule {
    constructor(client, dbConnection) {
        this.dbConnection = dbConnection;
        this.client = client;;
    }

    sendMessageToChannel = async () => {
        const guilds = await getGuilds();

        if (guilds.length === 0) {
            console.log('No guilds configured.');
            return;
        }
        

        guilds.forEach(async (item) => {            

            const channelId = item.channel_id;

            const channel = this.client.channels.cache.get(channelId);

            if (item.type === 'kill') {
                const guildMembers = await getMembers(item.guild.Id);

                if (!guildMembers) {
                    return;
                }

                guildMembers.forEach(async ({ members }) => {

                    const memberPromises = members.map(async (member) => {
                        const kills = await guildMemberKillsById(member.Id, { server: SERVERS.AMERICAS });
                        

                        if (kills) {
                            const oneHoursAgo = new Date(Date.now() - 1 * 3600000).toISOString();

                            const recentKills = kills.filter((kill) => new Date(kill.TimeStamp) >= new Date(oneHoursAgo));

                            if (recentKills.length > 0) {

                                recentKills.forEach(async ({ EventId }) => {
                                    const event = await getEvent(EventId, { server: SERVERS.AMERICAS });
                                    event.lootValue = await getLootValue(event, { server: SERVERS.AMERICAS });
                                    const eventImage = await generateEventImage(event);
                                    const eventInventoryImage = await generateInventoryImage(event);

                                    await channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(0x0099FF)
                                                .setTitle(`[${event.Killer.GuildName}] ${event.Killer.Name} killed [${event.Victim.GuildName}] ${event.Victim.Name}`)
                                                .setImage(`attachment://kill${EventId}.jpg`),

                                            new EmbedBuilder()
                                                .setColor(0xFF0000)
                                                .setImage(`attachment://inventory${EventId}.jpg`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Powered by ache !' }),

                                        ],
                                        files: [
                                            {
                                                attachment: eventImage,
                                                name: `kill${EventId}.jpg`
                                            },
                                            {
                                                attachment: eventInventoryImage,
                                                name: `inventory${EventId}.jpg`
                                            }
                                        ]
                                    });

                                });
                            }

                        }
                    })

                    await Promise.all(memberPromises);

                });

            }

            if (item.type === 'death') {
                const guildMembers = await getMembers(item.guild.Id);

                if (!guildMembers) {
                    return;
                }

                guildMembers.forEach(async ({ members }) => {

                    const memberPromises = members.map(async (member) => {
                        const deaths = await guildMemberDeathsById(member.Id, { server: SERVERS.AMERICAS });

                        if (deaths) {
                            const oneHoursAgo = new Date(Date.now() - 1 * 3600000).toISOString();

                            const recentDeaths = deaths.filter((death) => new Date(death.TimeStamp) >= new Date(oneHoursAgo));

                            if (recentDeaths.length > 0) {

                                recentDeaths.forEach(async ({ EventId }) => {
                                    const event = await getEvent(EventId, { server: SERVERS.AMERICAS });
                                    event.lootValue = await getLootValue(event, { server: SERVERS.AMERICAS });
                                    const eventImage = await generateEventImage(event);
                                    const eventInventoryImage = await generateInventoryImage(event);

                                    await channel.send({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(0xFF0000)
                                                .setTitle(`[${event.Killer.GuildName}] ${event.Killer.Name} killed [${event.Victim.GuildName}] ${event.Victim.Name}`)
                                                .setImage(`attachment://kill${EventId}.jpg`),

                                            new EmbedBuilder()
                                                .setColor(0x0099FF)
                                                .setImage(`attachment://inventory${EventId}.jpg`)
                                                .setTimestamp()
                                                .setFooter({ text: 'Powered by ache !' }),

                                        ],
                                        files: [
                                            {
                                                attachment: eventImage,
                                                name: `kill${EventId}.jpg`
                                            },
                                            {
                                                attachment: eventInventoryImage,
                                                name: `inventory${EventId}.jpg`
                                            }
                                        ]
                                    });

                                });
                            }

                        }
                    })

                    await Promise.all(memberPromises);

                });
            }


        });
    };

    handleSaveGuildMembers = async () => {
        const guilds = await getGuilds();

        if (guilds.length === 0) {
            console.log('No guilds configured.');
            return;
        }


        const memberPromises = guilds.map(async ({ guild }) => {
            try {
                await saveMembers(SERVERS.AMERICAS)

            } catch (error) {
                console.error(`Error fetching members for guild ${guild.Id}:`, error);
            }
        });

        await Promise.all(memberPromises);
    }

    async run() {

        //to send notifications
        cron.schedule('0 * * * *', async () => {
            await this.sendMessageToChannel();
        });

        //to save members
        cron.schedule('0 0 * * *', async () => {
            await this.handleSaveGuildMembers();
        });

    }

}

module.exports = {
    Schedule
};
