import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from 'axios';
import Modal from "react-modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import CustomEvent from "../components/CustomEvent";
import AdminModule from "../components/AdminModule";
import Checkbox from "@mui/material/Checkbox";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [eventapidata, setEventApidata] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [holidayCount, setHolidayCount] = useState(0);
    const [monthlyEventCount, setMonthlyEventCount] = useState(0);

    const fetchEventData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:4000/api/v2/addevent");
            const eventData = response.data;
            const formattedData = eventData.even.map(event => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end)
            }));
            setEventApidata(formattedData);

            // Get the current month
            const currentMonth = moment().month();

            // Filter holiday events and Sundays within the current month
            const holidays = formattedData.filter(event => event.title === 'Holiday' && moment(event.start).month() === currentMonth);
            const sundays = formattedData.filter(event => moment(event.start).day() === 0 && moment(event.start).month() === currentMonth);
            setHolidayCount(holidays.length + sundays.length);

            // Filter events for the current month
            const monthlyEvents = formattedData.filter(event => moment(event.start).month() === currentMonth);
            setMonthlyEventCount(monthlyEvents.length);

        } catch (error) {
            console.log("API not fetched", error);
        }
    };

    useEffect(() => {
        fetchEventData();
    }, []);

    const handleSelectedSlot = (slotInfo) => {
        const eventsOnDate = eventapidata.filter(event =>
            moment(event.start).isSame(slotInfo.start, 'day')
        );

        if (eventsOnDate.length > 0) {
            setSelectedEvent(eventsOnDate[0]);
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

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

    const roleOptions = [
        { value: "Teacher", label: "Teachers" },
        { value: "Students", label: "Students" },
        { value: "Non-teaching Staff", label: "Non-teaching Staff" },
        { value: "Parents", label: "Parents" },
    ];

    return (
        <>
            <div style={{ position: "relative", zIndex: "0", display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                <Calendar
                    localizer={localizer}
                    events={eventapidata}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 580, backgroundColor: 'white', padding: '30px', boxShadow: '0px 0px 5px grey' }}
                    selectable={true}
                    onSelectSlot={handleSelectedSlot}
                    onSelectEvent={handleEventClick}
                    components={{
                        event: CustomEvent
                    }}
                />

                {selectedEvent && (
                    <Modal isOpen={showModal} style={customStyles}>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                        ></button>
                        <h4>Event Details</h4>
                        <form enctype="multipart/form-data" key={selectedEvent.id}>
                            <div className="form-grid-container">
                                <div className="col-div">
                                    <label htmlFor="">Name</label>
                                    <input type="text" className="input-box" value={selectedEvent.eventName} readOnly />
                                </div>
                                <div className="col-div">
                                    <label htmlFor="eventTitle">Event Type</label>
                                    <input type="text" className="input-box" value={selectedEvent.title} readOnly />
                                </div>
                                <div className="col-div">
                                    <label htmlFor="startDate">Start Date</label>
                                    <Datetime value={selectedEvent.start} className="input-box" readOnly />
                                </div>
                                <div className="col-div">
                                    <label htmlFor="endDate">End Date</label>
                                    <Datetime value={selectedEvent.end} readOnly className="input-box"/>
                                </div>
                                <div className="col-div">
                                    <label htmlFor="">Full day</label>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={selectedEvent.duration}
                    
                                    >
                                        <FormControlLabel value="yes" control={<Radio />} label="Yes" disabled />
                                        <FormControlLabel value="no" control={<Radio />} label="No" disabled />
                                    </RadioGroup>
                                </div>
                                <div className="col-div">
                                    <label htmlFor="">Location</label>
                                    <input type="text" className="input-box" value={selectedEvent.location} readOnly />
                                </div>
                                </div>
                                <div>
                                <div className="col-div">
                                    <label htmlFor="">Roles</label>
                                    <div>
                                        {roleOptions.map((role) => (
                                            <FormControlLabel
                                                key={role.value}
                                                control={
                                                    <Checkbox
                                                        checked={selectedEvent.roles.includes(role.value)}
                                                        disabled
                                                    />
                                                }
                                                label={role.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="col-div">
                                    <label htmlFor="">Description</label>
                                    <br></br>
                                    <textarea
                                        name=""
                                        id=""
                                        cols="20"
                                        rows="2"
                                        style={{ width: "100%" }}
                                        value={selectedEvent.eventDescription}
                                        className="input-box"
                                        readOnly
                                    ></textarea>
                                </div>
                                <div className="col-div">
                                    <label htmlFor="">Attached File</label>
                                    <br></br>
                                    {selectedEvent.file && (
                                        <div className="attached-doc">
                                            <a href={`http://127.0.0.1:4000/${selectedEvent.file}`} target="_blank" rel="noopener noreferrer">
                                                <img src={`http://127.0.0.1:4000/${selectedEvent.file}`} alt="" className="image-container" />
                                            </a>
                                        </div>
                                    )}
                                    {!selectedEvent.file && (<p>No File is selected</p>)}
                                </div>
                            </div>
                        </form>
                    </Modal>
                )}
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 2fr', gap: '30px' }}>
                    <AdminModule bgcolor='#CE93D8' heading='No. of holidays in this month' numbers={holidayCount}></AdminModule>
                    <AdminModule bgcolor='#FF8369' heading='No. of Events in this month' numbers={monthlyEventCount}></AdminModule>
            
                </div>
            </div>
        </>
    );
}

export default Dashboard;
