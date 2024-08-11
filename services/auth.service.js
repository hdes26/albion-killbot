const bcryptjs = require('bcryptjs');

const Guild = require('../models/guild');
const Blacklist = require('../models/blacklist');

const { generateJWT } = require('../helpers/generate-jwt');


const loginService = async (payload) => {
    const { channelId } = payload;
    const channel = await Guild.findOne({ channelId });
    if (!channel) {
        return {
            msg: "Channel / Incorrect channel"
        }
    }

    const validChannel = bcryptjs.compareSync(channelId, channel.channelId);
    if (!validChannel) {
        return {
            msg: "Channel / Incorrect channel"
        }
    }

    const token = await generateJWT(channel.id);

    return { channel, token }
}

const logoutService = async ({ authorization: token }) => {
    const blacklist = new Blacklist({ token });
    return await blacklist.save();
}


module.exports = {
    loginService,
    logoutService
};