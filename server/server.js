import express from "express"
import morgan from "morgan"
import cors from "cors"
import dbConnect from "./db/dbConfig.js"
import dotenv from "dotenv"
import userRouter from "./ruotes/userRoutes.js"

dotenv.config()
const app=express()

//middlewares
app.use(express.json()) //json parser
app.use(express.urlencoded({extended:true})) //url data parser
app.use(morgan("dev")) //morgan(http logger)
app.use(cors({origin:"http://localhost:5173"})) //cors server access


//demo API
app.get("/",(req,res)=>{
    res.send({message:"SERVER AT WORK"})
})

//routes
app.use("/user",userRouter)

//listen
const PORT=process.env.PORT ||4000;
const hostname="localhost";
app.listen(PORT,hostname,()=>{
    console.log(`server running in http://${hostname}:${PORT}`)
    dbConnect()
})