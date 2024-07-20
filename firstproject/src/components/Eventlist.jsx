import Create from "../pages/Create"

export default function Eventlist({eventList}){
    return(
   <>
   <div>
    <input type="text" />

    <div>
    {eventList.map((eve,index)=>(
        <div><h4>{eve.title}</h4>
        <p>{eve.description}</p>
        </div>
    ))}
    </div>
    </div>
   </>     
    )
}