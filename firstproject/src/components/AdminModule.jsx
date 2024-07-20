import { fontSize, fontWeight } from "@mui/system"

export default function AdminModule({heading,numbers,bgcolor}){

const headText={color:'white',
    fontSize:'18px',
    fontWeight:'500'
}
const numText={
    color:'white',
    fontSize:'40px',
    fontWeight:'bold'
}
const divStyle={
    backgroundColor:bgcolor,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    padding:' 10px 20px',
    gap:'15px',
    borderRadius:'10px',
  
}
    return(
        <>
            <div style={divStyle}>
                <p style={headText}>{heading}</p>
                <p style={numText}>{numbers}</p>
            </div>
        </>
    )
}