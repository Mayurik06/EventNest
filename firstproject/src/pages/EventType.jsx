import Create from "./Create";
import Eventlist from "../components/Eventlist";

export default function EventType(){
    return(
        <>
            <Create></Create>
            <Eventlist eventList={e}></Eventlist>
        </>
    )
}