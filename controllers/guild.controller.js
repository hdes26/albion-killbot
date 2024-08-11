const { response } = require('express');
const { createGuild } = require("../services/guild.service");


const create = async (req, res = response) => {
    try {
        const { server } = req.query;
        let guild = await createGuild(req.body, { server });
        res.json(guild);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: error });
    }
}




module.exports = {
    create
}