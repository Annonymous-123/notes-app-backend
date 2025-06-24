import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';


dotenv.config();

const {Pool}=pg;

const pool=new Pool({
  connectionString:process.env.Database_Url,
  ssl:{
    rejectUnauthorized:false,
  },
});
const app=express();
const port=3000;
app.use(express.json());

app.get('/api/notes',async(req,res)=>{
  try{
  const result=await pool.query('Select * from notes');
    console.log(result.rows);
  res.json(result.rows);}
  catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
});
app.post('/api/notes',async(req,res)=>{
  try{
  console.log(req.body);
 const result=  await pool.query('INSERT INTO NOTES (title,content) values($1,$2) returning*',[req.body.title,req.body.content]);
  res.status(201).json(result.rows[0]); 

  }
  catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
})

app.listen(port,()=>{
  console.log(`Server running on port ${port}`);
});