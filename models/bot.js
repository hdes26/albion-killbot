const config = require("config");
const { Client, GatewayIntentBits, Partials, EmbedBuilder, REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');

const { dbConnection } = require("../database/config");
const { SERVERS } = require("../helpers/albion");
const { createGuild } = require("../services/guild.service");
const { commands } = require("../src/bot/commands/start.command");
const { Schedule } = require("./schedule");




class Bot {
    constructor() {
        this.client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
        this.rest = new REST({ version: "10" }).setToken(config.get("discord.token"));
        this.init = false;


        this.client.on('guildCreate', this.handleGuildCreate.bind(this));
        this.client.on('interactionCreate', this.handleInteractionCreate.bind(this));
        this.client.once('ready', this.handleReady.bind(this));

        if (!this.init) {

            this.database = this.connectDB()

            this.run();

            this.init = true;
        }

    }

    async connectDB() {
        return await dbConnection();
    }

    async handleGuildCreate(guild) {
        console.log(`New server registration: ${guild.name} (ID: ${guild.id})`);

        try {
            await this.rest.put(Routes.applicationGuildCommands(config.get("discord.clientId"), guild.id), {
                body: commands,
            });

            console.log(`Registered bot in: ${guild.name}`);
        } catch (error) {
            console.error(`Error registering on the server ${guild.name}:`, error);
        }
    }

    async handleInteractionCreate(interaction) {
        if (!interaction.isCommand()) return;

        const { commandName, options, channel } = interaction;

        if (commandName === 'set') {
            const type = options.getString('type');

            const newData = {
                channelId: channel.id,
                channel: channel.name,
                type: type,
                guild: null,
            };

            createGuild(newData, { server: 'americas' })

            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Killboard')
                .setDescription(`The channel: ${channel} has been configured to receive Kill notifications. If you haven't already, use the '/killboard guild' command to register your guild.`)
                .setThumbnail('https://i.ibb.co/6wSQ18j/logo-albion-bot.jpg')
                .setTimestamp()
                .setFooter({ text: 'Enjoy !', iconURL: 'https://i.ibb.co/6wSQ18j/logo-albion-bot.jpg' });

            interaction.reply({ embeds: [exampleEmbed] });
        }

        if (commandName === 'killboard') {
            const guildName = options.getString('guild');

            const newData = {
                channelId: channel.id,
                channel: channel.name,
                type: null,
                guild: guildName,
            };


            await createGuild(newData, { server: SERVERS.AMERICAS })


            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Killboard')
                .setDescription(`Guild: ${guildName} successfully registered on the channel 💥killboard. Now you need to configure which channels you want to receive notifications on. Use the /killboard set command on the desired channel to receive notifications.`)
                .setThumbnail('https://i.ibb.co/6wSQ18j/logo-albion-bot.jpg')
                .setTimestamp()
                .setFooter({ text: 'Enjoy !', iconURL: 'https://i.ibb.co/6wSQ18j/logo-albion-bot.jpg' });

            interaction.reply({ embeds: [exampleEmbed] });
        }
    }

    async handleReady() {
        const schedule = new Schedule(this.client, this.database);
        schedule.run()
        console.log(`Logged in as ${this.client.user.tag}!`);
    }


    async run() {
        await this.client.login();
    }

}

module.exports = {
    Bot
};
