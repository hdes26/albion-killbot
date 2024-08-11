const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate');

const { create } = require('../controllers/guild.controller');


const router = Router();


router.post('/', [
    check('channelId', 'channelId is required').isString(),
    check('channel', 'channelId is required').isString(),
    validateFields
], create);



module.exports = router;