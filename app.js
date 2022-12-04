const express = require("express");
const homeRouter = require("./routers/homeRouter");
require('dotenv').config()
const app = express()
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const bodyParser = require("body-parser");
const DB = "mongodb+srv://shankarjatin:jaiHanumanji@cluster0.b1no4tl.mongodb.net/userData4?retryWrites=true&w=majority";
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful");
}).catch((err) => console.log(err) );



app.get("/",(req,res)=>{
    res.render("pages/index")
})
app.use(homeRouter);





app.listen(3000,()=>{
    console.log("server is live")
})