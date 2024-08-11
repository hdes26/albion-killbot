const Guild = require('../models/guild');
const Member = require('../models/member');

const { guildByName, guildMembers } = require('../ports/albion');


const createGuild = async (payload, { server }) => {
    const { channelId, channel, type, guild: guildName } = payload;

    const exist = await Guild.findOne({ channel_id: channelId });


    if (exist) {

        if (!exist.guild && guildName) {

            exist.guild = await guildByName(guildName, { server });
            exist.active = true;

            const update = await Guild.findOneAndUpdate({ channel_id: channelId }, exist);
            return update;
        }
        if (!exist.type && type) {

            exist.type = type;
            exist.active = true;


            const update = await Guild.findOneAndUpdate({ channel_id: channelId }, exist);
            return update;
        }
        if (exist.guild && guildName) {

            exist.guild = await guildByName(guildName, { server });

            const update = await Guild.findOneAndUpdate({ channel_id: channelId }, exist);
            return update;
        }
        if (exist.type && type) {

            exist.type = type;

            const update = await Guild.findOneAndUpdate({ channel_id: channelId }, exist);
            return update;
        }
    }

    if (guildName) {
        const newGuild = new Guild({ channel_id: channelId, channel, guild: await guildByName(guildName, { server }) });

        return await newGuild.save();
    }

    if (type) {
        const newGuild = new Guild({ channel_id: channelId, channel, type, guild: null });

        return await newGuild.save();
    }

}

const getGuilds = async () => {

    const guilds = await Guild.find().where({ active: true });

    return guilds;

}
const saveMembers = async (server) => {

    const guilds = await Guild.find().where({ active: true });

    if (guilds.length === 0) {
        console.log('No guild configured.');
        return;
    }

    for (const { guild } of guilds) {
        const { Id, ...rest } = guild._doc;

        const members = await guildMembers(Id, { server });

        if (!members) {
            continue;
        }

        const membersMap = members.map(data => {
            return { Id: data.Id, Name: data.Name ?? '', }
        });


        rest.members = membersMap;


        const save = new Member({ guild_id: Id, ...rest });

        try {
            await save.save();
        } catch (error) {
            console.error(`Error saving members ${Id}:`, error);
        }
    }

}

const getMembers = async (guildId) => {

    const members = await Member.find().where({ guild_id: guildId });

    return members;

}




module.exports = {
    createGuild,
    getGuilds,
    saveMembers,
    getMembers
};