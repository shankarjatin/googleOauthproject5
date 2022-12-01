const express = require("express");
const homeRouter = require("./routers/homeRouter");
require('dotenv').config()
const app = express()
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("pages/index")
})
app.use(homeRouter);

app.get("")



app.listen(5000,()=>{
    console.log("server is live")
})