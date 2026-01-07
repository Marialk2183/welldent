const express=require("express")
const mysql=require("sqlite3")
const cors=require("cors")
const database = require("./database/database")

const app=express()
app.use(cors())

const db= new sqlite3.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dental"
})


app.get("/users",(req,res)=>{
    db.query("SELECT * FROM patients",(err,result)=>
    {
        if(err)
        {
            res.status(500).send(err)
        }
        else
            {
                res.json(result)
            }
    })
})
app.listen(3000)