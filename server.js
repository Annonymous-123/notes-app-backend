import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from "cors";


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

app.use(cors({
  origin: "https://keeper-app-full-version.glitch.me", // your frontend Glitch URL
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true
}));

app.get('/',async(req,res)=>{
  try{
  const result=await pool.query('Select * from notes');
    console.log(result.rows);
  res.json(result.rows);}
  catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
});
app.post('/',async(req,res)=>{
  try{
  console.log(req.body);
 const result=  await pool.query('INSERT INTO NOTES (title,content) values($1,$2) returning*',[req.body.title,req.body.content]);
  res.status(201).json(result.rows[0]); 

  }
  catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
});
app.delete('/:id',async(req,res)=>{
  const id=req.params.id;
  console.log(id);
  try{
 const result= await pool.query('DELETE FROM NOTES WHERE ID=$1 RETURNING *',[id]);
    console.log(id);
    res.status(200).json(result.rows[0]); 
  }
   catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
});
app.patch('/:id',async(req,res)=>{
const id=req.params.id;
const title=req.body.title;
const content=req.body.content;
  console.log(id,title,content);
  try{
   
    if(content!==undefined&&title!==undefined){
      const result=await pool.query(`UPDATE NOTES SET CONTENT=$1,TITLE=$2 WHERE ID=$3 RETURNING*`,[content,title,id]);
       res.status(200).json(result.rows[0]); 
      }
    else if(content!==undefined){
    const result=await pool.query(`UPDATE NOTES SET CONTENT=$1 where ID=$2 RETURNING*`,[content,id]);
       res.status(200).json(result.rows[0]); 
    }
    else if(title!==undefined){
    const result=await pool.query(`UPDATE NOTES SET TITLE=$1 where ID=$2 RETURNING*`,[title,id]);
       res.status(200).json(result.rows[0]); 
    }
  }
  

  catch(err){
    console.error("Error",err.message);
    res.status(500).json({error:'Internal Server Error'});
  }
});
app.listen(port,()=>{
  console.log(`Server running on port ${port}`);
});