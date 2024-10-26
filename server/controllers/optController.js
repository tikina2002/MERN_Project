import { otpModel } from "../models/otpModel.js"
import userModel from "../models/userModel.js"
import { generateOTP } from "../utils/opt.js"
import { sendOtpMail } from "../utils/nodemailer.js"
import { createToken } from "../utils/jwt.js"
export const forgotPassword=async (req,res)=>{
    try{
        const {email}=req.body
        const response= await userModel.findOne({email})
        if(response){
            const otp=generateOTP()
            const isUser=await otpModel.findOne({email})
            if(isUser){
                let lastUpdated=isUser.updatedAt.getTime() //this convert the time to milisecind value
                let currentTime=new Date().getTime()
                if((currentTime-lastUpdated)>30000){
                    await otpModel.updateOne({email},{$set:{otp}})
                    await sendOtpMail(email,otp)
                }
                else{
                    res.status(400).send({error:"wait for 30sec before generating another otp"})
                }
            }
            else{
                let otpData=new otpModel({email,otp})
                await otpData.save()
                await sendOtpMail(email,otp)
                 
            }
            res.status(200).send({message:"otp generated"})
        }
        else{
            return res.status(400).send({error:"User is not registered"})
        }
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}

export const verifyOtp=async(req,res)=>{
    try{
        const {email,otp}=req.body
        let otpData=await otpModel.aggregate([{$match:{email}},{
            $lookup:{
                from:"users",
                localField:"email",
                foreignField:"email",
                as:"userDetails"
            }
        }])
        otpData=otpData[0]
        if(otpData){
            let lastUpdated=otpData.updatedAt.getTime()
            console.log(lastUpdated)
            let currentTime=new Date().getTime()
            let fiveMin=1000*60*5
            if(currentTime-lastUpdated<=fiveMin){
                if(otpData.otp==otp){
                    let userId=otpData.userDetails[0]._id.toString()
                    let token=createToken({id:userId})
                    return res.status(200).send({message:"OTP is matched",token})
                }
                else{
                    res.status(400).send({error:"otp is not matched...Try Again"})
                }
            }
            else{
                res.status(400).send({error:"otp expired"})
            }
        }
        else{
            res.status(400).send({error:"otp is not generated for this email address"})
        }
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}
