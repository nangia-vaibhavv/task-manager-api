const jwt=require('jsonwebtoken')
const myformdata=require('../models/myformdata')
const auth=async(req,res,next)=>{
    // console.log('auth middleware')
    // next()
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await myformdata.findOne({_id:decoded._id, 'tokens.token':token})
        if(!user)
        {
            throw new Error()
        }
        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).send({error:'Please Authenticate'})
    }
}
module.exports=auth