import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

let url=process.env.MONGO_URL;

const dbConnect=async ()=>{
    try{
        await mongoose.connect(url)
        console.log("DB connected");
    }
    catch(error){
        console.log("dB conncetion error"+error.message)
    }
}

export default dbConnect