import Colorpicker from "./Colorpicker"

export default function ColorPickedTab(){
    const gridStyle={
        display:'inline-block',
        display:'grid',
        gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr',
        gap:'10px'
    }

    const handleClick=(color)=>{
        console.log('clicked com',color);
    }
   
    return(
        <>
        <div style={gridStyle}>
<Colorpicker pickedColor='#EF5350' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#F7DEA0' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#689F38' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#64B5F6' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#4DB6AC' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#CE93D8' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#3DEDFF' onClick={handleClick}></Colorpicker>
<Colorpicker pickedColor='#FF8369' onClick={handleClick}></Colorpicker>
</div>
</>
    )
}