import express,{NextFunction, Request,Response} from 'express';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const secretKey=process.env.SECRET_KEY;
const prisma=new PrismaClient();
const blogging=express.Router();

export interface CustomRequest extends Request {
    email?: string;
   
}

blogging.use('/*',async(req:CustomRequest,res:Response,next:NextFunction)=>{
    const BearerToken=req.headers.authorization;
    const token=BearerToken?.split(' ')[1];

    try{
        const decode=jwt.verify(token as string, secretKey as string) as JwtPayload
        req.email=decode.payload ;
        
    } catch(error){
        console.log(error);
        res.status(404).json({
            msg:"Something went wrong! Please try again"
        })
    }

    next();
})

blogging.post('/',async(req:CustomRequest,res:Response)=>{

    const {title,content,published}=req.body;
    const BearerToken=req.headers.authorization;
    const token=BearerToken?.split(' ')[1];

    try{
        const user=await prisma.user.findFirst({
            where:{
                email:req.email
            }
        })
        const postData=await prisma.post.create({
            data:{
                authorId:user?.id ||-1,
                title,
                content,
                published
            }
        })
        if(!postData || !user){
            res.status(404).json({
                msg:"Unable to post data! Please try again"
            })
            return;
        }

        res.status(200).json({
            id:postData.id
        })

    } catch(error){
        console.log(error);
        res.status(404).json({
            msg:"Something went wrong! Please try again"
        })
    }

    

})


blogging.put('/',async(req:CustomRequest,res:Response)=>{
    const {title,content,published,id}=req.body;
    try {
        const {email}=req;
        const existingUser=await prisma.user.findFirst({
            where:{
                email
            }
        })

        const updateData=await prisma.post.update({
            where:{
                id

            },
            data:{
                title,
                content,
                published
            }
        })

        if(!existingUser || !updateData){
            res.status(404).json({
                msg:"Unknown error happened please try again!"
            })
            return;
        }

        res.status(200).json({
            msg:updateData
        })

    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg:"Unknown error happened please try again!!"
        })
    }



    
})

//Todo: Add pagination
blogging.get('/bulk',async(req:Request,res:Response)=>{
     try {
        const totalPosts=await prisma.post.findMany({
            where:{
                published:true
            }
        })
        if(totalPosts.length===0){
            res.status(400).json({
                msg:"No Published data found"
            })
        }
        res.status(200).json({
            msg:totalPosts?.map(post=>({
                title:post.title,
                content:post.content,
                published:post.published
            }))
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg:"Unknown error happened!! Please try again"
        })
    }

   
})

blogging.get('/:id',async(req:Request,res:Response)=>{
    const id=parseInt(req.params.id);
    console.log('Hello from the dynamic route')
    try {
        const postData=await prisma.post.findFirst({
            where:{
                id
            }
        })
        if(!postData){
            res.status(400).json({
                msg:"Data not found!! Please try again"
            })
            return;
        }
        res.status(200).json({
            msg:{
                title:postData.title,
                content:postData.content
            }
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            msg:"Unknown error happened please try again"
        })
    }
   
})


export default blogging;