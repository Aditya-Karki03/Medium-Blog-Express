import express from "express";
import signing from "./routes/signing";
import blogging from "./routes/blogging";
import cors from 'cors'
const app=express();
const port=3000;

app.use(cors())

app.use(express.json())

app.use('/api/v1/user',signing);

app.use('/api/v1/blog',blogging)


app.listen(port,()=>{
    console.log(`App is listening at port ${port}`)
})