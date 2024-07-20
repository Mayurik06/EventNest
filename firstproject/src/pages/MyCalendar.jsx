import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "../components/Style.css";
import Modal from "react-modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import CustomEvent from "../components/CustomEvent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

function MyCalendar(props) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [roles, setRoles] = useState([]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [apidata, setApidata] = useState([]);
  const [eventapidata, setEventApidata] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [eventId, setEventId] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const roleOptions = [
    { value: "Teacher", label: "Teachers" },
    { value: "Students", label: "Students" },
    { value: "Non-teaching Staff", label: "Non-teaching Staff" },
    { value: "Parents", label: "Parents" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/events");
      setApidata(response.data.event);
    } catch (error) {
      console.error("Error fetching API data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectedSlot = (slotInfo) => {
    const today = moment().startOf("day");
    if (moment(slotInfo.start).isBefore(today)) {
      toast.error("Cannot select a past date.");
      return;
    }

    setShowModal(true);
    setSelectedStartDate(slotInfo.start);
    setSelectedEndDate(slotInfo.end);
    setSelectedEvent(null);
    setEventId(""); // Reset eventId

    setEventName("");
    setEventTitle("");
    setDuration("");
    setRoles([]);
    setLocation("");
    setDescription("");
    setFile(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEventId(event._id); // Set eventId
    setEventName(event.eventName);
    setEventTitle(event.title);
    setSelectedStartDate(new Date(event.start));
    setSelectedEndDate(new Date(event.end));
    setDuration(event.duration);
    setRoles(event.roles || []);

    console.log(event.roles);
    setLocation(event.location);
    setDescription(event.eventDescription);
    setFile(event.file); // Set the file details
    setShowModal(true);
  };

  const isValidDate = (current) => {
    const today = moment().startOf("day");
    return current.isSameOrAfter(today);
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().setHours(0, 0, 0, 0);

    if (!eventName) errors.eventName = "Event name is required";
    if (!eventTitle) errors.eventTitle = "Event title is required";
    if (!roles.length) errors.roles = "Roles are required";
    if (!duration) errors.duration = "Duration is required";
    if (!selectedStartDate) errors.selectedStartDate = "Start date is required";
    if (!selectedEndDate) errors.selectedEndDate = "End date is required";
    if (new Date(selectedStartDate) >= new Date(selectedEndDate)) {
      errors.date = "Start date must be before end date";
      toast.error(errors.date);
    }
    if (new Date(selectedStartDate) < today) {
      errors.startDate = "Start date cannot be before today";
      toast.error(errors.startDate);
    }
    if (new Date(selectedEndDate) < today) {
      errors.endDate = "End date cannot be before today";
      toast.error(errors.endDate);
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("title", eventTitle);
    formData.append("start", selectedStartDate.toISOString());
    formData.append("end", selectedEndDate.toISOString());
    formData.append("duration", duration);
    formData.append("location", location);
    formData.append("roles", JSON.stringify(roles));
    // formData.append("roles", roles);

    formData.append("eventDescription", description);
    if (file) formData.append("file", file);

    try {
      if (selectedEvent) {
        // Update event
        await axios.patch(
          `http://127.0.0.1:4000/api/v2/addevent/${selectedEvent._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Event updated successfully");
      } else {
        // Create new event
        console.log(formData.entries.roles)
        for (var pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        await axios.post("http://127.0.0.1:4000/api/v2/addevent", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Event created successfully");
      }
      setRefreshData(!refreshData); // trigger data refresh
    } catch (error) {
      console.error(
        "Error saving event",
        error.response ? error.response.data : error.message
      );
    }

    setShowModal(false);
    setEventName("");
    setEventTitle("");
    setSelectedStartDate(new Date());
    setSelectedEndDate(new Date());
    setDuration("");
    setRoles([]);
    setLocation("");
    setDescription("");
    setFile(null);
    setSelectedEvent(null);
    setEventId(""); // Reset eventId
  };

  const deleteEvent = async () => {
    if (eventId) {
      // Check eventId
      try {
        await axios.delete(
          `http://127.0.0.1:4000/api/v2/addevent/${selectedEvent._id}`
        );
        setRefreshData(!refreshData); // trigger data refresh
      } catch (error) {
        console.error(
          "Error deleting event",
          error.response ? error.response.data : error.message
        );
      }
      setShowModal(false);
      setEventName("");
      setEventTitle("");
      setSelectedStartDate(new Date());
      setSelectedEndDate(new Date());
      setDuration("");
      setRoles([]);
      setLocation("");
      setDescription("");
      setFile(null);
      setSelectedEvent(null);
      setEventId(""); // Reset eventId
    }
  };

  const fetchEventData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v2/addevent");
      const eventData = response.data;
  console.log(eventData)
      setEventApidata(
        eventData.even.map((eve) => ({
          ...eve,
          start: new Date(eve.start),
          end: new Date(eve.end),
        }))
      );
    } catch (error) {
      console.error("Error fetching event data", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [refreshData]);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fefefe",
      padding: "20px",
      borderRadius: "8px",
      width: "80%",
      maxWidth: "600px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 1001,
      overflow:'hidden'
    },
  };

  const handleRoleChange = (role) => {
    setRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };
console.log("roles",roles);
  return (
    <div style={{ position: "relative", zIndex: "0" }}>
      {/* <ToastContainer /> */}
      <Calendar
        localizer={localizer}
        events={eventapidata}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 580 }}
        selectable={true}
        onSelectSlot={handleSelectedSlot}
        onSelectEvent={handleSelectEvent}
        components={{
          event: CustomEvent,
        }}
      />
      <Modal isOpen={showModal} style={customStyles}>
        <button
          type="button"
          className="btn-close"
          onClick={() => setShowModal(false)}
        ></button>
        <h4>{selectedEvent ? "Edit Event" : "Add Event"}</h4>
        <form onSubmit={saveEvent} encType="multipart/form-data">
          <div className="form-grid-container">
            <div className="col">
              <label htmlFor="">Name</label>
              <input
                type="text"
                className="input-box"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
              />
           <div className="error-container"> {validationErrors.eventName && (
            <span className="error">{validationErrors.eventName}</span> )}</div>  
             
            </div>
            <div className="col">
              <label htmlFor="eventTitle">Event Type</label>
              <select
                id="eventTitle"
                value={eventTitle}
                className="input-box"
                onChange={(e) => setEventTitle(e.target.value)}
              >
                <option value="" disabled>
                  Select Event
                </option>
                {apidata.map((eve) => (
                  <option key={eve.id} value={eve.name}>
                    {eve.name}
                  </option>
                ))}
              </select>
              <div className="error-container">
              {validationErrors.eventTitle && (
                <span className="error">{validationErrors.eventTitle}</span>
              )}
              </div>
             
            </div>
            <div className="col">
              <label htmlFor="startDate">Start Date</label>
              <Datetime
                value={selectedStartDate}
                onChange={(date) => setSelectedStartDate(date.toDate())}
                className="input-box"
                isValidDate={isValidDate}
                inputProps={{ style: { width: "100%" } }} 
              />
              <div className="error-container">
              {validationErrors.selectedStartDate && (
                <span className="error">
                  {validationErrors.selectedStartDate}
                </span>
              )}
              </div>
             
            </div>
            <div className="col">
              <label htmlFor="endDate">End Date</label>
              <Datetime
                value={selectedEndDate}
                onChange={(date) => setSelectedEndDate(date.toDate())}
                className="input-box"
                isValidDate={isValidDate}
            
              />
              <div className="error-container">
              {validationErrors.selectedEndDate && (
                <span className="error">
                  {validationErrors.selectedEndDate}
                </span>
              )}
              
              {validationErrors.date && (
                <span className="error">{validationErrors.date}</span>
              )}
              </div>
             
            </div>
            <div className="col">
              <label htmlFor="">Full day</label>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              <div className="error-container">
              {validationErrors.duration && (
                <span className="error">{validationErrors.duration}</span>
              )}
              </div>
             
            </div>

            <div className="col">
              <label htmlFor="">Location</label>
              <input
                type="text"
               className="input-box"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="col">
            <label htmlFor="">Roles</label>
            <div>
              {roleOptions.map((role) => (
                <FormControlLabel
                  key={role.value}
                  control={
                    <Checkbox
                      checked={roles.includes(role.value)}
                      onChange={() => handleRoleChange(role.value)}
                     
                    />
                  }
                  label={role.label}
                />
              ))}
            </div>
            <div className="error-container">
            {validationErrors.roles && (
              <span className="error">{validationErrors.roles}</span>
            )}
            </div>
            
          </div>
          <div className="col">
            <label htmlFor="">Description</label>
            <br></br>
            <textarea
              name=""
              id=""
              cols="20"
              rows="2"
              style={{ width: "100%" }}
              className="input-box"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="col">
            <label htmlFor="">{selectedEvent ? "Update File" : "Add file"}</label>
            <br></br>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              name="file"
              accept=".jpeg,.jpg,.pdf"
            />
            {selectedEvent && selectedEvent.file && (
              <div>
                <p>
                  Selected File:{
" "}
                  <a
                    href={`http://127.0.0.1:4000/${selectedEvent.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedEvent.file}
                  </a>
                </p>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              type="submit"
              className="btn sub-btn"
              style={{
                background: "linear-gradient(128deg, #1e6dbd, #3287db)",
                color: "white",
              }}
            >
              {selectedEvent ? "Update" : "Save"}
            </button>
            {selectedEvent && (
              <button
                type="button"
                className="delete-btn"
                onClick={deleteEvent}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MyCalendar;

