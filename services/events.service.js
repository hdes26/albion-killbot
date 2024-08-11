
const albion = require("../ports/albion");



async function getEvent(eventId, { server }) {
  return await albion.getEvent(eventId, { server });
}

async function getEventVictimLootValue(event, { server }) {
  return albion.getLootValue(event, { server });
}

module.exports = {
  getEvent,
  getEventVictimLootValue
};
