const EventType = require("../models/eventtype");

const   getAllEvent = async (req, res) => {
    const event = await EventType.find({});
    res.status(200).json({ event, count: event.length });
  };

  const addEvent = async (req,res) => {
    const event = await EventType.create(req.body);
    res.status(201).json({ event });
  }

  const getEventType = async (req, res) => {

    const { id: EventTypeID } = req.params
try{
    const Events = await EventType.findById(EventTypeID);
    if (!Events) {
      res.status(404).json({ msg: `Person with ${EventTypeID} doesn't exist` });
    }
     res.status(200).json({ EventType });
  }catch(error){
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
  };

  const updateEvent = async (req, res) => {
    const {
      body: { name, description },
      params: { id: EventTypeID },
    } = req
  
    if (name === '' || description === '') {
      return res.status(400).json({msg: "Bad request error. Please add values to all fields"});
    }
    const EventTypeUpdate = await EventType.findByIdAndUpdate(
      { _id: EventTypeID },
      req.body,
      { new: true, runValidators: true }
    )
    if (!EventTypeUpdate) {
      return res.status(404).json({msg: `No person with id ${id}. Please enter valid id`});
    }
    return res.status(200).json({ EventType: EventTypeUpdate });
  }

  const deleteevent = async (req, res) => {
    const {
      params: {id: EventTypeID}
    } = req;
    
    const person = await EventType.findOneAndDelete({ _id: EventTypeID });
  
    if (!EventType) {
      return res.status(404).json({msg: `No person with id ${id} found`})
    }
    res.status(200).send();
  };

//   const event1 = new EventType({
//     name:"shreya",
//     description:"hello i m priya ",
//     color:"pink"
// });

// event1.save();

  module.exports = {
    getAllEvent,
    addEvent,
    getEventType,
    updateEvent,
    deleteevent
  }