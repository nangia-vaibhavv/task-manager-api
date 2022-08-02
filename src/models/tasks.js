const mongoose=require('mongoose')
const validator=require('validator')

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        default:'no description added',
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    // connecting task wiht myformdata
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        // to establish id with original name of user use ref
        ref:'Myformdata'
    }
},{
    timestamps:true
})


const tasks=new mongoose.model('tasks',taskSchema)

module.exports=tasks