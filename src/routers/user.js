const express=require('express')
const myformdata=require('../models/myformdata')

const router=new express.Router()
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail, sendCancelEmail}=require('../emails/account')
router.get('/test', (req,res)=>{
    res.send('This is sample router')
})



// // this fucntion uses promise chaining where after myformdatava;ue created it calls save
// app.post('/users',(req,res)=>{
//     const myformdatavalue=new myformdata(req.body)
//     myformdatavalue.save().then(()=>{
//         res.status(201)
//         res.send(myformdatavalue)
//     }).catch((e)=>{
//         res.status(400)
//         res.send(e)
//     })
// })

// USING ASYNC AWAIT
router.post('/users',async(req,res)=>{
    const myformdatavalue=new myformdata(req.body)
    try{
        await myformdatavalue.save()
        sendWelcomeEmail(myformdatavalue.email,myformdatavalue.name)
        const token=await myformdatavalue.generateAuthToken()
        res.status(200).send({myformdatavalue,token})
    }catch(e){
        res.status(400).send('error occured')
        console.log('error',e
        )
    }
})


// app.get('/users',(req,res)=>{
//     myformdata.find({}).then((value)=>{
//         res.send(value)
//     }).catch((e)=>{
//         res.status(500)
//         res.send(e)
//     })
// })

// ASYNC AWAIT

// router.get('/users',auth,async(req,res)=>{
//     try{
//        const value= await myformdata.find({})
//         res.status(200).send(value)
//     }catch(e){
//         console.log('error',e)
//     }
// })


// with authentication get request
router.get('/users/me',auth,async(req,res)=>{
   res.send(req.user)
})

// app.get('/users/:id',(req,res)=>{
//     const _id=req.params.id
//     myformdata.findById(_id).then((data)=>{
//         if(!data){
//             return res.status(404).send('no user with this id')
//         }
//         res.send(data)
//     }).catch(()=>{
//         res.status(500).send()
//     })
//     // console.log(req.params)
// })

// using ASYNC AWAIT later this is done from /me
router.get('/users/:id',async(req,res)=>{
    const _id=req.params.id
    try{
       const result= await myformdata.findById(_id)
       if(!result){
        res.status(400).send()
       }
        res.status(200).send(result)
    }catch(e){
        res.status(500).send()
    }
})

// PATCH TO UPDATE USER NOW USED AS /me with req.user
// router.patch('/users/:id',async(req,res)=>{
//    const updates=Object.keys(req.body)
//    const allowedUpdates=['name','email','password','age']
//    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
//    if(!isValidOperation){
//     return res.status(400).send({errpr:'Invalid updates'})
//    }
//    try{
//         const userToUpdate=await myformdata.findById(req.params.id)
//         updates.forEach((update)=>{
//             userToUpdate[update]=req.body[update]
//         })
//         await userToUpdate.save()
//         // const userToUpdate=await myformdata.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!userToUpdate){
//             return res.status(404).send()
//         }
//         res.send(userToUpdate)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })


router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
     return res.status(400).send({error:'Invalid updates'})
    }
    try{
         updates.forEach((update)=>{
             req.user[update]=req.body[update]
         })
         await req.user.save()
         res.send(req.user)
     }catch(e){
         res.status(400).send(e)
     }
 })
 



// router.delete('/users/:id',async(req,res)=>{
//     try{
//         const user=await myformdata.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        sendCancelEmail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await myformdata.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
        console.log(e)
    }
})

router.post('/users/logout',auth, async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send('Failed to logout all')
    }
})

const upload=multer({
    // dest:'avatars',
    limit:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return  cb(new Error ('Please upload img format files'))
        }
        cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    // req.user.avatar=req.file.buffer
    const buffer=await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(500).send({error:error.message})

})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await myformdata.findById(req.params.id)
        if(!user || !user.avatar)
        {
            throw new Error('No user or image found')
        }
        res.set('Content-type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
        console.log(e)
    }
})

module.exports=router
