const eve = require("../models/addEvent");
// const upload = require("../uploadConfig");
const path=require('path');
const { updateEvent } = require("./events");

const getEvents = async (req, res) => {
  const even = await eve.find({});
  res.status(200).json({ even, count: even.length });
};

const addEventCalendar = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body

    let filePath = ''; // Initialize filePath

    // Check if file is uploaded
    if (req.file) {
      filePath = req.file.path; // Assign file path if uploaded
    } else {
      console.log("No file uploaded"); // Log that no file was uploaded
      // Handle the case where no file was uploaded, maybe set a default or do nothing
      // Example: filePath = ''; // or any default value you want to set
    }

    if (req.body.roles) {
      req.body.roles = JSON.parse(req.body.roles);
    }
    // Create a new forum instance with the file path
    const newaddeve = new eve({
        ...req.body,
        file: filePath // Assuming fileForum field is for storing file path
    });
    

    // Save the forum to the database
    await newaddeve.save();
    res.status(201).json(newaddeve);
  } catch (error) {
    console.error("Error: ", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};


const getAddedEvent = async (req, res) => {
  const { id: eveID } = req.params;

  try {
    const event = await eve.findById(eveID);
    if (!event) {
      return res.status(404).json({ msg: `Event with ID ${eveID} doesn't exist` });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAddedEvent = async (req, res) => {
  const { id: eveID } = req.params;
  const updates = { ...req.body };

  if (req.file) {
    updates.file = req.file.path;
  }
  if (req.body.roles) {
    updates.roles = JSON.parse(req.body.roles);
  }
  try {
    const updatedEvent = await eve.findByIdAndUpdate(eveID, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ msg: `Event with ID ${eveID} not found` });
    }

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error("Error: ", error); // Log the error
    res.status(500).json({ error: error.message });
  }
};


const deleteAddedEvent = async (req, res) => {
  const { id: eveID } = req.params;

  try {
    const event = await eve.findByIdAndDelete(eveID);

    if (!event) {
      return res.status(404).json({ msg: `No event with ID ${eveID} found` });
    }
    res.status(200).json({ message: 'Event deleted', event });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: error.message });
  }

};

module.exports = {
  getEvents,
  addEventCalendar,
  getAddedEvent,
  updateAddedEvent,
  deleteAddedEvent,
};
