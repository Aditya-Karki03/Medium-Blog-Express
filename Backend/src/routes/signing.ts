import express,{Request,Response} from 'express';

const signing=express.Router();


signing.post('/signup',(req:Request,res:Response)=>{
    
    res.status(200).json({
        msg:"This is the correct route!!"
    })
})

signing.post('/signin',(req:Request,res:Response)=>{

    res.status(200).json({
        msg:"This is the signin route!!"
    })

})

export default signing;