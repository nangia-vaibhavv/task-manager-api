const express=require('express')
require('./db/mongoose')
const myformdata=require('./models/myformdata')
const tasks=require('./models/tasks')
const app=express()
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const port=process.env.PORT ;


// // middle ware let when server is in maintainence maode than we need to trigger this

// app.use((req,res,next)=>{
//     if(req.method==='GET')
//     {
//         res.status(502).send('GEt request is disbaled')
//     }else{
//         next()
//     }
// })

// // middleware for maintainence mode and stop all service
// app.use((req,res,next)=>{
//     res.status(503).send('Service is barred due to maintainence')
// })


// to convert text coming from api as a json object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
    console.log("Server is up and running on port",port)
})




// bcrypts for password protetion
const bcrypt = require('bcrypt');
const myFunction=async()=>{
    const password='vaibhav123'
    const hashedPassword=await bcrypt.hash(password,8)
    // console.log(password)
    // console.log(hashedPassword)


    // compare passwords or decrypt
    const isMatch=await bcrypt.compare('vaibhav123',hashedPassword)
    // console.log(isMatch)
}
myFunction()


// jwt token
const jwt=require('jsonwebtoken')
const myJwtFunction=async()=>{
    const token=jwt.sign({_id:'abc123'},'thisisnewcourse',{expiresIn:'7 days'})
    console.log("hello=>"+token)

    // verify token
    const data=jwt.verify(token,
        'thisisnewcourse')
    console.log(data)
}
myJwtFunction()


// fetch complete info from owner id in task to owner name from diff model
// const main=async()=>{
//     const task=await tasks.findById('62e232860a6f7671ce7ae097')
//     // id of owner to complete owner
//     await task.populate('owner')
//     console.log(task.owner)
// }
// main()



// file upoads
const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/))
//         {
//             return cb(new Error('Please upload a word document'))
//         }
//         cb(undefined,true)
//         // cb(new Error('File must be a pdf'))
//         // cb(undefined,true)
//         // cb(undefined,false)
//     }
// })
// app.post('/uploads',upload.single('upload'),(req,res)=>{
//     res.status(200).send()
// })

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/))
        {
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined,true)
    }
})
// const errorMiddleware=(req,res,next)=>{
//     throw new Error('From my middleware')
// }
app.post('/uploads',upload.single('upload'),(req,res)=>{
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
