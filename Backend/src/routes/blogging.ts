import express,{Request,Response} from 'express';
const blogging=express.Router();

blogging.post('/api/v1/blog',(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"This is the correct response"
    })
})


blogging.put('api/v1/blog',(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"This is also the correct response"
    })
})

blogging.get('api/v1/blog/:id',(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"This is the get request for the specifc blog"
    })
})

blogging.get('api/v1/blog/bulk',(req:Request,res:Response)=>{
    res.status(200).json({
        msg:"This is the bulk request"
    })
})

export default blogging;