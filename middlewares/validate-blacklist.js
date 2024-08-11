const { response, request } = require('express');

const Blacklist = require('../models/blacklist');


const validateBlacklist = async (req = request, res = response, next) => {

    const token = req.header('Authorization');
    const tokenInBlacklist = await Blacklist.findOne({ token });

    if (tokenInBlacklist) {
        return res.status(401).json({
            msg: 'The token is invalid'
        });
    }

    next();

}




module.exports = {
    validateBlacklist
}