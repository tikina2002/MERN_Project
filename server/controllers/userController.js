import userModel from "../models/userModel.js"
import { comparePassword, createHashPassword } from "../utils/bcrypt.js"
import { createToken } from "../utils/jwt.js"

export const userSignup= async(req,res)=>{
    try{
        let user=req.body
        let {firstName,email,password} = user
        if(firstName && email && password){
            let hashedPassword=await createHashPassword(password)
            let userData=new userModel({...user,password:hashedPassword})
            let response=await userData.save()
            let token=createToken({id:response._id})
            return res.status(201).send({token})
            // return res.status(201).send(response)
        }
        else{
            return res.status(400).send({error:"Provide all required fields"})
        }
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}
export const userLogin=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(email && password ){
            const user= await userModel.findOne({email})
            if(user){
                //compare password logic
                const isMatched=comparePassword(password,user.password)
                if(isMatched){
                    let token=createToken({id:user._id})
                    return res.status(200).send({message:"Login Successfull",token})
                }
                else{
                    return res.status(400).send({error:"Password not matched"})
                }
            }
            else{
                return res.status(400).send({error:"User not registered"})
            }
        }
        else{
            return res.status(400).send({error:"Provide all filds"})
        }
    }
    catch(error){
        return res.status(500).send({error:"internal server error"})
    }
}

export const getUser=async(req,res)=>{
    try{
        // console.log(req.id)
        const {id}=req
        const userData=await userModel.findById(id,{_id:0,__v:0,password:0})
        return res.status(200).send(userData)
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}

export const updateUser=async (req,res)=>{
    try{
        const {id}=req
        const data=req.body
        delete data.password
        delete data.email
        await userModel.findByIdAndUpdate(id,{$set:{...data}})
        return res.status(200).send({message:"User Data Updated"})
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}

export const deleteUser=async (req,res)=>{
    try{
        const {id}=req
        const response=await userModel.findByIdAndDelete(id)
        if(response){
            return res.status(200).send({message:"User Data Deleted Successfully"})
        }
        else{
            return res.status(400).send({error:"User not found"})
        }  
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message})
    }
}

export const changePassword=async (req,res)=>{
    try{
        const {id}=req
        const {newPassword}=req.body
        let hashedPassword=await createHashPassword(newPassword)
        await userModel.findByIdAndUpdate(id,{$set:{password:hashedPassword}})
        return res.status(201).send({message:"user password updated"})
    }
    catch(error){
        res.status(500).send({error:"internal server error", msg:error.message}) 
    }
}

