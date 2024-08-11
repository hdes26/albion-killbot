const { Schema, model } = require('mongoose');


const MemberSchema = Schema({
    Id: {
        type: String,
        required: [true, 'Id is required']
    },
    Name: {
        type: String,
        required: [true, 'Name is required'],
    },
});

const MembersSchema = Schema({
    guild_id: {
        type: String,
        required: [true, 'guild_id is required']
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
    members: {
        type: [MemberSchema],
        required: [true, 'members is required']

    },
});



MembersSchema.methods.toJSON = function () {
    const { __v, _id, ...members } = this.toObject();
    return members;
}

module.exports = model('Members', MembersSchema);