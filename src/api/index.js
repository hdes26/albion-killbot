const config = require("config");
const Server = require('../../models/server');


async function run() {
    if (!config.has("discord.token")) {
        throw new Error("Please define DISCORD_TOKEN environment variable with the discord token.");
    }
    if (!config.has("discord.clientId")) {
        throw new Error("Please define DISCORD_CLIENT_ID environment variable with the discord client id.");
    }
    if (!config.has("discord.clientSecret")) {
        throw new Error("Please define DISCORD_CLIENT_SECRET environment variable with the discord client secret.");
    }

    console.log(`Starting Albion-Killbot rest api.`);

    const server = new Server();

    server.listen();
}

async function cleanup(reason) {
    console.log(`Shutting down Api. Reason: ${reason}`);
    
    if (api.server) {
        await api.server.close((error) => process.exit(error ? 1 : 0));
    } else {
        process.exit(0);
    }
}

module.exports = {
    run,
    cleanup,
};
