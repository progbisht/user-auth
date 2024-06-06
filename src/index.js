import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import app from "./app.js"

dotenv.config({
    path: "./env"
})


const port = process.env.PORT || 5000

// database connection

const dbConnection = async() => {
    try{
        await connectDB()
        app.listen(port, () => {
            console.log(`App running on PORT ${port}`)
        })
        
    }
    catch(err){
        console.log(`MongoDB connection failed! ${err}`);
    }
}


dbConnection()






















// connectDB()
// .then(
//     ()=> {
//         app.listen(port, () => {
//             console.log(`App running on PORT ${port}`)
//         })

//     }
// )
// .catch(
//     (err) => {
//         console.log(`MongoDB connection failed! ${err}`);
//     }
// )