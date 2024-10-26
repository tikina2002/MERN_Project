import express from  "express";
import userModel from "../models/userModel.js";
import { changePassword, deleteUser, getUser, updateUser, userLogin, userSignup } from "../controllers/userController.js";
import { varifyToken } from "../middlewares/jwt.js";
import {forgotPassword, verifyOtp } from "../controllers/optController.js";
import { verify } from "crypto";

const userRouter =express.Router()

//APIs
//demo
userRouter.get("/",(req,res)=>{
    res.send("user router is working")
})
userRouter.get("/all",async(req,res)=>{ //varifying user collection
    let allUser=await userModel.find()
    res.status(200).send(allUser)
})

//user Registration(signup)
userRouter.post("/signup",userSignup)

//user Login
userRouter.post("/login",userLogin)

//get user(Auth token) authorization
userRouter.get("/auth",varifyToken,getUser)

//update user(Auth Token)
userRouter.put("/update",varifyToken,updateUser)

//delete user(Auth Token)
userRouter.delete("/delete",varifyToken,deleteUser)

//forgot password
userRouter.post("/password",forgotPassword)

//verify otp
userRouter.post("/otp/verify",verifyOtp)
//change pasword
userRouter.patch("/change/pass",varifyToken,changePassword)

export default userRouter;