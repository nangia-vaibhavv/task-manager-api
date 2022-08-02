const mongoose=require('mongoose')
const validator=require('validator')
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
})

// //2) model for description and completed fellds
// const tasks=new mongoose.model('tasks',{
//     description:{
//         type:String
//     },
//     completed:{
//         type:Boolean
//     }
// })
// const mytasks=new tasks({
//     description:'Hello this is my description',
//     completed:true
// })

// mytasks.save().then(()=>{
//     console.log(mytasks)
// }).catch((error)=>{
//     console.log(error)
// })


// // 3) model for validator and sanitization
// const myformdata=new mongoose.model('myformdata',{
//     name:{
//         type:String,
//         // validator
//         required:true,
//         trim:true
//     },
//     age:{
//         type:Number,
//         validate(value){
//             if(value<0){
//                 throw new Error('Age should be psitive')
//             }
//         }
//     },
//     phone:{
//         type:Number
//     },
//     email:{
//         type:String,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('not  valid email')
//             }
//         },
//         trim:true,
//         lowercase:true
//     },
//     gender:{
//         type:String,
//         default:'male'
//     },
//     password:{
//         type:String,
//         minLength:6,
//         trim:true,
//         validate(value){
//             if(value.includes('password')){
//                 throw new Error("Password cannot contain password")
//             }
//         }
//     }

// })
// const myformdatavalue=new myformdata({
//     name:'malkeet',
//     age:25,
//     phone:888554554522,
//     email:'vaibhav@gmail.com',
//     password:'myserietkay'
// })
// myformdatavalue.save().then(()=>{
//     console.log(myformdatavalue)
// }).catch((error)=>{
//     console.log(error)
// })