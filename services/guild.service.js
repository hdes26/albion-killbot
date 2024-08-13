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
    try {
        const guilds = await Guild.find({ active: true });

        if (guilds.length === 0) {
            console.log('No guilds configured.');
            return;
        }

        for (const { guild } of guilds) {
            const { Id, ...rest } = guild._doc;

            const members = await guildMembers(Id, { server });

            if (!members) {
                console.log(`No members found for guild ${Id}.`);
                continue;
            }

            const membersMap = members.map(data => ({
                Id: data.Id,
                Name: data.Name ?? '',
            }));

            rest.members = membersMap;

            const exist = await Member.findOneAndUpdate(
                { guild_id: Id },
                { members: membersMap },
                { new: true, upsert: true } // Creates a new document if it doesn't exist
            );

            if (!exist) {
                console.log(`Guild ${Id} does not exist, creating a new entry.`);
                const newMember = new Member({ guild_id: Id, ...rest });
                await newMember.save();
            }
        }

        console.log('Members saved/updated successfully.');
    } catch (error) {
        console.error('An error occurred while saving members:', error);
    }
};


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