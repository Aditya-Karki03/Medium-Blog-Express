import express,{Request,Response} from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'

dotenv.config();
const secretKey: string | undefined=process.env.SECRET_KEY;
const signing=express.Router();
const prisma=new PrismaClient()

signing.post('/signup',async(req:Request,res:Response)=>{

    const {name,email,password}=req.body;
    try {
        
        const newUser=await prisma.user.create({
            data:{
                name,
                email,
                password
            }
        })

        if(!newUser){
            res.status(404).json({
                msg:'Incorrect Data!'
            })
            return;
        }

        const token=jwt.sign({
            payload:newUser.email           
        }, secretKey as string)

        res.status(200).json({
            msg: token
        })

    } catch (error) {
        console.log(error);
        res.status(411).json({
            msg:"Something went wrong please try again!!"
        })
    }
    
})

signing.post('/signin',async(req:Request,res:Response)=>{

    const {email,password}=req.body;
    const tokenWithBearer=req.headers.authorization;
    const token=tokenWithBearer?.split(' ')[1];

    
    try {

        const decode=jwt.verify(token as string,secretKey as string) as JwtPayload;
        console.log(decode);
        if(decode.payload!==email){
            res.json({
                msg:"User does not match, with the token"
            })
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg:"Invalid Token"
        })
    }

    try {
        const verifyUser=await prisma.user.findFirst({
            where:{
                email,
                password
            }
        })
        console.log(verifyUser)
        if(!verifyUser){
            res.status(404).json({
                msg:"User not found!! Please try signing up"
            })
        }
        res.status(200).json({
            msg:"User signed In successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg:'Something went wrong! Please try again'
        })
    }


    

})

export default signing;

