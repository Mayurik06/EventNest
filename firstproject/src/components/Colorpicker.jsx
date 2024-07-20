

export default function Colorpicker({pickedColor, onClick}){
    const divStyle={
        backgroundColor:pickedColor,
        height:'20px',
        width:'20px',
borderRadius:'50%'
    }
    var lastClicked=null
    var v;

    function handleClick(e){
       
        lastClicked=e.target
        const color=e.target.style.backgroundColor;
        // console.log(color);
        onClick(color);
        e.target.style.opacity=0.6;

    }
    return(
     <>
        <div style={divStyle} onClick={handleClick}></div>
     </>   
    )
}