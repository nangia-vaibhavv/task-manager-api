const express=require('express')
const tasks=require('../models/tasks')

const router=new express.Router()
const auth=require('../middleware/auth')


// app.post('/tasks',(req,res)=>{
//     const mytasks=new tasks(req.body)
//     mytasks.save().then(()=>{
//         res.status(201)
//         res.send(mytasks)
//     }).catch((e)=>{
//         res.status(400)
//         res.send(e)
//     })
// })


// // USING ASYNC AWAIT
// router.post('/tasks',async(req,res)=>{
//     const mytasks=new tasks(req.body)
//     try{
//         await mytasks.save()
//         res.status(200).send('task created')
//     }catch(e){
//         res.status(500).send('error',e)
//     }
// })
// USING ASYNC AWAIT with connectied auth
router.post('/tasks',auth,async(req,res)=>{
    // const mytasks=new tasks(req.body)
    const mytasks=new tasks({
       ...req.body,
       owner:req.user._id
    })
    try{
        await mytasks.save()
        res.status(200).send('task created')
    }catch(e){
        res.status(500).send('error',e)
    }
})


// app.get('/tasks',(req,res)=>{
//     tasks.find({}).then((data)=>{
//         res.status(200)
//         res.send(data)
//     }).catch((e)=>{
//         res.status(500)
//         res.send(e)
//     })
// })


// // using ASYNC AWAIT later by auth
// router.get('/tasks',async(req,res)=>{
//     try{
//         const foundData=await tasks.find({})
//         res.status(200).send(foundData)
//     }catch(e){
//         res.status(500).send()
//     }
// })

// GET/tasks?completed=true
// GET/tasks?limit=10?skip=20 goes to page 3 and fetches 10 resuts from it
// GET/tasks?sortBy=createdAt_ascor _desc
router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort={}
    if(req.query.completed)
    {
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(":")
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try{
        // const foundData=await tasks.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                // limit:parseInt(req.query.limit),
                sort
            }
            
        })
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send()
        console.log(e)
    }
})

// app.get('/tasks/:id',(req,res)=>{
//     const _id=req.params.id
//     tasks.findById(_id).then((data)=>{
//         res.status(200)
//         res.send(data)
//     }).catch((e)=>{
//         res.status(500)
//         res.send('not found')
//     })
// })

// // ASYNC AWAIT later with/me instead of id
// router.get('/tasks/:id',async(req,res)=>{
//     const _id=req.params.id
//     try{
//         const fetchedData=await tasks.findById(_id)
//         if(!fetchedData){
//             res.status(400).send()
//         }
//         res.status(200).send(fetchedData)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const fetchedData=await tasks.findById(_id)
        const fetchedData=await tasks.findOne({_id,owner:req.user._id})
        if(!fetchedData){
            res.status(400).send()
        }
        res.status(200).send(fetchedData)
    }catch(e){
        res.status(500).send(e)
    }
})


// // task update by id
// router.patch('/tasks/:id',async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowedUpdates=['description','completed']
//     const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
//     if(!isValidOperation)
//     {
//         return res.status(400).send({error:'Invalid updates'})
//     }
//     try{
//         // const taskToUpdate=await tasks.findByIdAndUpdate(_req.params.id,req.body,{new:true})
//         const taskToUpdate=await tasks.findById(req.params.id)
//         updates.forEach((update)=>taskToUpdate[update]=req.body[update])
//         await taskToUpdate.save()
//         if(!taskToUpdate){
//             res.status(404).send()
//         }
//         res.status(200).send(taskToUpdate)
//     }catch(e){
//         res.status(500).send()
//     }
// })

// task update by id using auth
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation)
    {
        return res.status(400).send({error:'Invalid updates'})
    }
    try{
        const taskToUpdate=await tasks.findOne({_id:req.params.id,owner:req.user._id})
        
        if(!taskToUpdate){
            res.status(404).send()
        }
        updates.forEach((update)=>taskToUpdate[update]=req.body[update])
        await taskToUpdate.save()
        res.status(200).send(taskToUpdate)
    }catch(e){
        res.status(500).send()
    }
})


// router.delete('/tasks/:id',async(req,res)=>{
//     try{
//         const taskToDelete=await tasks.findByIdAndDelete(req.params.id)
//         if(!taskToDelete){
//             res.status(404).send()
//         }
//         res.status(200).send(taskToDelete)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const taskToDelete=await tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!taskToDelete){
            res.status(404).send()
        }
        res.status(200).send(taskToDelete)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router