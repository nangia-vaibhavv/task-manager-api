// crud operation in js

// it allows us to connect to mongodb database from node js application
const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

// url that has to be conneted with mongodb
const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = 'task-manager-app'

// // if your own objet d to be provided
const ObjectID=mongodb.ObjectId
const id=new ObjectID()
// console.log(id)
// console.log(id.getTimestamp())
// console.log(id.id)
// console.log(id.id.length)
// console.log(id.toHexString().length)

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("unable to connect to database")
    }
    // console.log("connected correctly.")
    const db = client.db(databaseName)

// 1)

    // db.collection('users').insertOne({
    //     name:'Rajat',
    //     age:21
    // },(error,result)=>{
    //     if(error) return console.log("unable to add")
    //     console.log(result.ops)
    // })



    // 2)

    db.collection('users').insertMany([
        {
            name: 'Rajat',
            age: 21
        },
        {
            name:'Vaibhav',
            age:19
        },
        {
            name:'Simar',
            age:20
        },
        {
            name:'Vaibhav',
            age:24
        }
    ], (error, result) => {
    if (error) return console.log("unable to add")
    console.log(result.ops)
})



// //updating dtaa in db
// const updatePromise=db.collection('users').updateOne(()=>{
//     _id:new ObjectID("62d9357ad0dd4d910e4f7816")
// },{
//    $set:{
//     name:'MIKE'
//    }
// })
// updatePromise.then((result)=>{
//     console.log("success", result)
// }).catch((error)=>{
//     console.log("Error occured in updation",error)
// })


// 3)

 
// db.collection('tasks').insertMany([
//     {
//         description: 'clean floor',
//         completed: true
//     },
//     {
//         description: 'clean toilet',
//         completed: false
//     },
//     {
//         description: 'clean room',
//         completed: true
//     }
// ], (error, result) => {
// if (error) return console.log("unable to insert task")
// console.log(result.ops)
// })






// // finding or fetching data from db here from task

// db.collection('tasks').findOne({
//     description:'clean room'
// },(error,user)=>{
//     if(error)console.log("hi"+error);
//     else console.log(user)
// })



})
