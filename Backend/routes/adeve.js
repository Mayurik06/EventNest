const express = require("express");
const router = express.Router();
const upload=require('../uploadConfig')

const {getEvents,addEventCalendar,getAddedEvent,updateAddedEvent,deleteAddedEvent}=require('../controllers/addEv')




router.route("/addevent").get(getEvents)
router.route("/addevent").post(upload.single('file'), addEventCalendar);
router.route("/addevent/:id").patch(upload.single('file'),updateAddedEvent)
router.route("/addevent/:id").get(getAddedEvent)
router.route("/addevent/:id").delete(deleteAddedEvent);

module.exports=router;