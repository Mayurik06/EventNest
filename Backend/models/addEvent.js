const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const addEventSchema=new Schema({
    eventName:{
        type:String,
        // required:true
    },
    title:{
        type:String,
        // required:true,
    },
    start:{
        type:Date,
        // required:true
    },
    end:{
        type:Date,
        // required:true
    },
    duration:{
        type:String,
        enum: ['yes', 'no'],
    },
    location:{
        type:String,
    },
    roles:{
        type:Array,
        // required:true
    },
    eventDescription:{
        type:String,
    },
 file:{
        type:String,
        
    }
})


module.exports=mongoose.model('addEvent',addEventSchema)