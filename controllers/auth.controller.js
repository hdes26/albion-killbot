const { response } = require('express');
const { loginService, logoutService } = require("../services/auth.service");


const login = async (req, res = response) => {

    try {
        let login = await loginService(req.body);
        res.json(login);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: error });
    }
}

const logout = async (req, res = response) => {

    try {
        let logout = await logoutService(req.headers);
        res.json(logout);
    } catch (error) {
        console.log(error);
        res.status(404).json({ msg: error });
    }
}




module.exports = {
    login,
    logout
}