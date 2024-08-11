const eventsService = require("../services/events.service");
const eventsImage = require("../services/images.service");



async function getEventImage(req, res) {
  const { eventId } = req.params;
  const { server } = req.query;


  const event = await eventsService.getEvent(eventId, { server });
  if (!event) return res.sendStatus(404);

  event.lootValue = await eventsService.getEventVictimLootValue(event, { server });
  
  const eventImage = await eventsImage.generateEventImage(event);

  return res.set("Content-Disposition", `inline; filename="${event.EventId}-event.png"`).type("png").send(eventImage);
}

async function getEventInventoryImage(req, res) {
  const { eventId } = req.params;
  const { server } = req.query;

  const event = await eventsService.getEvent(eventId, { server });
  if (!event) return res.sendStatus(404);

  const inventory = event.Victim.Inventory.filter((i) => i != null);
  if (!inventory || inventory.length === 0) return res.sendStatus(404);

  event.lootValue = await eventsService.getEventVictimLootValue(event, { server });
  const eventInventoryImage = await eventsImage.generateInventoryImage(event);

  return res
    .set("Content-Disposition", `inline; filename="${event.EventId}-inventory.png"`)
    .type("png")
    .send(eventInventoryImage);
}

module.exports = {
  getEventImage,
  getEventInventoryImage
};
