const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
// make schema out of this model to use bcrypt feature
const myformdataSchema=new mongoose.Schema({
    name:{
        type:String,
        // validator
        required:true,
        trim:true
    },
    age:{
        type:Number,
        validate(value){
            if(value<0){
                throw new Error('Age should be psitive')
            }
        }
    },
    phone:{
        type:Number
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('not  valid email')
            }
        },
        trim:true,
        lowercase:true,
        unique:true
    },
    gender:{
        type:String,
        default:'male'
    },
    password:{
        type:String,
        minLength:6,
        trim:true,
        validate(value){
            if(value.includes('password')){
                throw new Error("Password cannot contain password")
            }
        }
    },
    tokens:[{
        token:{
           type:String,
           required:true
        }
    }],
    avatar:{
        type:Buffer
    }

},{
    timestamps:true
})

myformdataSchema.virtual('tasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})


// myformdataSchema.methods.getPublicProfile=function(){
//     const user=this
//     const userObject=user.toObject()


//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }

myformdataSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()


    delete userObject.password
    delete userObject.tokens
    return userObject
}

myformdataSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token

}

myformdataSchema.statics.findByCredentials=async(email,password)=>{
    const user=await myformdata.findOne({email:email})
    if(!user){
        throw new Error('Unable to find user')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Wrong password')
    }
    return user
}
// plane text password
myformdataSchema.pre('save',async function(){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    // console.log('just before saveing')
    // next()
})


// delete user tasks when user is removed
const task=require('./tasks')
myformdataSchema.pre('remove',async function(next){
    const user=this
   await task.deleteMany({owner:user._id})
    next()
})

// 3) model for validator and sanitization
const myformdata=new mongoose.model('Myformdata',myformdataSchema)

module.exports=myformdata