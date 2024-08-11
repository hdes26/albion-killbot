const { Schema, model } = require('mongoose');


const GuildSchema = Schema({
    Id: {
        type: String,
        required: [true, 'Id is required']
    },
    Name: {
        type: String,
        required: [true, 'Name is required'],
    },
    AllianceId: {
        type: String,
        required: [true, 'AllianceId is required']
    },
    AllianceName: {
        type: String,
        default: null, 
    },
    KillFame: {
        type: Number,
        default: null, 
    },
    DeathFame: {
        type: Number,
        default: null, 
    },
});

const GuildsSchema = Schema({
    channel_id: {
        type: String,
        required: [true, 'channel_id is required']
    },
    channel: {
        type: String,
        required: [true, 'channel is required'],
    },
    type: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    guild: {
        type: GuildSchema,
    },
});



GuildsSchema.methods.toJSON = function () {
    const { __v, _id, ...guilds } = this.toObject();
    return guilds;
}

module.exports = model('Guilds', GuildsSchema);