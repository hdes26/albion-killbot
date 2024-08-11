const { Schema, model } = require('mongoose');

const BlacklistSchema = Schema({
    token: {
        type: String,
    },
});



BlacklistSchema.methods.toJSON = function() {
    const { __v, _id, ...blacklist  } = this.toObject();
    return blacklist;
}

module.exports = model( 'Blacklist', BlacklistSchema );