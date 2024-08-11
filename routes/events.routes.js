const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate');

const { getEventImage, getEventInventoryImage } = require("../controllers/events.controller");

const router = Router();

router.get(`/:eventId`, [
    check('eventId', 'eventId is required').isString(),
    validateFields
], getEventImage);

router.get(`/:eventId/loot`, [
    check('eventId', 'eventId is required').isString(),
    validateFields
], getEventInventoryImage);



module.exports = router;