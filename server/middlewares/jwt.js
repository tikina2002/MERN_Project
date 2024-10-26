import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const secretKey= process.env.JWT_SECRET

export const varifyToken=async (req,res,next)=>{
    try{
        let authToken=req.headers.authorization.split(' ')[1]
        // console.log(authToken)
        if(authToken){
            try{
                // const data=jwt.verify(authToken,secretKey)
                // console.log(data)
                const {id}=jwt.verify(authToken,secretKey)
                if(id){
                    req.id=id
                    next() 
                }
                else{
                    return res.status(400).send({error:"User id id not valid"})
                }
            }
            catch(error){
                return res.status(400).send({error:"Token Verification failed"})
            }
            
        }
        else{
            return res.status(400).send({error:"Authorization token is Required"})
        }

    }
    catch(error){
        return res.status(500).send({error:"Internal Server Error",msg:error.message})
    }
}