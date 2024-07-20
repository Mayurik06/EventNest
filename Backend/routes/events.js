const express = require("express");
const router = express.Router();

const {  getAllEvent,addEvent,getEventType, updateEvent,deleteevent } = require("../controllers/events");

router.route("/events").get(getAllEvent)
router.route("/events").post(addEvent);
router.route("/events/:id").patch(updateEvent)
router.route("/events/:id").get(getEventType)
router.route("/events/:id").delete(deleteevent);

module.exports = router;