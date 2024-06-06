import express, { json, urlencoded } from "express"
const app = express()
import cookieParser from "cookie-parser"
import cors from 'cors'
import { corsOptions } from "./config/corsOptions.config.js"


app.use(cors({ corsOptions }))
app.use(json({limit: "16kb"}))
app.use(urlencoded({extended:true, limit: "16kb"}))
app.use(cookieParser())
app.use(express.static("public"))


// router imports
import userRouter from "./routers/user.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)






export default app