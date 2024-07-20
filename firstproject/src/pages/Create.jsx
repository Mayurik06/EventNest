import { useState, useEffect } from "react";
import Colorpicker from "../components/Colorpicker";
import axios from "axios";
import "./Create.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Create() {
  const [inputEvent, setInputEvent] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [apidata, setApidata] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [errors, setErrors] = useState({});

  const eventExists = (name) => {
    return apidata.some((event) => event.name === name);
  };

  const validateForm = () => {
    let formErrors = {};
    if (!inputEvent) formErrors.inputEvent = "Event Name is required";
    if (eventExists(inputEvent) && !editingEventId) {
      formErrors.inputEvent = "Event Name already exists";
    }
    if (!inputDescription) formErrors.inputDescription = "Description is required";
    if (!bgColor) formErrors.bgColor = "Color is required";
    return formErrors;
  };

  const submitFunc = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please correct the errors before submitting.");
      return;
    }

    const payload = {
      name: inputEvent,
      description: inputDescription,
      color: bgColor,
    };

    try {
      if (editingEventId) {
        await axios.patch(`http://127.0.0.1:4000/api/v1/events/${editingEventId}`, payload);
        toast.success("Event updated successfully!");
      } else {
        await axios.post("http://127.0.0.1:4000/api/v1/events", payload);
        toast.success("Event created successfully!");
      }

      setBgColor("");
      setInputDescription("");
      setInputEvent("");
      setEditingEventId(null);
      setRefreshData(!refreshData);
    } catch (error) {
      console.error("Failed to submit the form:", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/events");
      setApidata(response.data.event);
    } catch (error) {
      console.error("Failed to fetch events", error);
      toast.error("Failed to fetch events. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshData]);

  const deleteEventType = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:4000/api/v1/events/${id}`);
      setApidata(apidata.filter((event) => event._id !== id));
      toast.success("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  const enterUpdateState = (event) => {
    setEditingEventId(event._id);
    setInputEvent(event.name);
    setInputDescription(event.description);
    setBgColor(event.color);
  };

  const handleInputEvent = (e) => {
    setInputEvent(e.target.value);
  };

  const handleDescription = (e) => {
    setInputDescription(e.target.value);
  };

  const handleClick = (color) => {
    setBgColor(color);
  };

  const handleClickOutside = (e) => {
    const clickedInsideMenu = e.target.closest(".event-item");
    if (!clickedInsideMenu) {
      setApidata((prevData) =>
        prevData.map((event) => ({ ...event, isOpen: false }))
      );
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cardGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginTop: "20px",
    marginBottom: "20px",
    width: "100%",
  };

  const bigContStyle = {
    marginTop: "20px",
    marginBottom: "20px",
    height: "100%",
    width: "100%",
  };

  return (
    <>
      <ToastContainer />
      <div className="grid-container">
        <div className="form-container">
          <h5>Create Event Type</h5>
          <form onSubmit={submitFunc} className="form">
            <div>
              <input
                type="text"
                placeholder="Event Name"
                name="name"
                value={inputEvent}
                onChange={handleInputEvent}
                 className="cr-input"
              />
              {errors.inputEvent && <p className="error">{errors.inputEvent}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={inputDescription}
                onChange={handleDescription}
                className="cr-input"
              />
              {errors.inputDescription && <p className="error">{errors.inputDescription}</p>}
            </div>
            <label htmlFor="color">Color</label>
            <div style={{ width: "70%" }}>
              <div className="colorGrid">
                <Colorpicker pickedColor="#EF5350" onClick={handleClick} />
                <Colorpicker pickedColor="#F7DEA0" onClick={handleClick} />
                <Colorpicker pickedColor="#689F38" onClick={handleClick} />
                <Colorpicker pickedColor="#64B5F6" onClick={handleClick} />
                <Colorpicker pickedColor="#4DB6AC" onClick={handleClick} />
                <Colorpicker pickedColor="#CE93D8" onClick={handleClick} />
                <Colorpicker pickedColor="#3DEDFF" onClick={handleClick} />
                <Colorpicker pickedColor="#FF8369" onClick={handleClick} />
              </div>
              {errors.bgColor && <p className="error">{errors.bgColor}</p>}
            </div>
            <button type="submit">{editingEventId ? "Update" : "Submit"}</button>
          </form>
        </div>
        <div className="showingList form-container">
          <h5>Event List</h5>
          <div style={{ height: "90%", overflowY: apidata.length >= 7 ? "scroll" : "hidden" }}>
            <div style={apidata.length !== 0 ? cardGridStyle : bigContStyle}>
              {apidata.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50%" }}>
                  <span style={{ padding: "20px 30px", border: "1px solid black" }}>Empty List</span>
                </div>
              ) : (
                apidata.map((eve) => (
                  <div key={eve._id} className="event-item" style={{ backgroundColor: eve.color, color: "white", padding: "10px", position: "relative" }}>
                    <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", marginTop: "10px" }}>{eve.name}</p>
                    <p style={{ fontSize: "12px", margin: "0" }}>{eve.description}</p>
                    <div style={{ position: "absolute", top: "8px", right: "8px", textAlign: "right" }}>
                      <i className="fa-solid fa-ellipsis-vertical" style={{ padding: "5px" }} onClick={() => setApidata(prevData => prevData.map(item => item._id === eve._id ? { ...item, isOpen: !item.isOpen } : item))}></i>
                      {eve.isOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "rgba(0,0,0,0.2)", padding: "5px", borderRadius: "5px" }}>
                          <i className="fa-solid fa-pen" onClick={() => enterUpdateState(eve)}></i>
                          <i className="fa-solid fa-trash" onClick={() => deleteEventType(eve._id)}></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
