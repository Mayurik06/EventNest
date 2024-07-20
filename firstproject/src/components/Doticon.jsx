import { useState, useEffect } from "react";
import axios from "axios";

export default function Doticon(eventid){
const [clicked,setClicked]=useState(true);
const [apidata, setapidata] = useState([]);


function isClicked(){
    setClicked(!clicked);
}

const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:4000/api/v1/events");
      console.log("response2", response);
      const data = response.data;
      setapidata(data.event);
      
    } catch (error) {
      console.log("api not fetched", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteEventType = async(id) => {
    try {
        await axios.delete(`http://127.0.0.1:4000/api/v1/events/${id}`);
        setapidata(apidata.filter(data => data.id !== id));
    } catch (error) {
        console.error('Error deleting event', error);
    }

  }


    return(
        <>
        <div style={{ position: "absolute", top: "8px", right: "8px",textAlign:'right' }}>
        <i class="fa-solid fa-ellipsis-vertical" onClick={isClicked}></i>
        <div style={{display:'flex',flexDirection:'column',gap:'10px',backgroundColor:'rgba(0,0,0,0.2)',padding:'5px',borderRadius:'5px',visibility:clicked==true?'hidden':'visible'}}>
        <i class="fa-solid fa-pen" onClick={()=>deleteEventType(eventid)}></i>
        <i class="fa-solid fa-trash"></i>
        </div>
        </div>
        </>
    )
}