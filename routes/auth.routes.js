const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate');

const { login } = require('../controllers/auth.controller');


const router = Router();


router.post('/', [
    check('channelId', 'channelId is required').isString(),
    validateFields
], login);



module.exports = router;