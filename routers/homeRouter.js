const express = require("express");
const Router  = express.Router();
require('dotenv').config();
// const HomeSchema = require("../models/homeSchema");
require("../passport-setup")
const cookieSession = require('cookie-session')
const passport =require("passport");


Router.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))


  const isLoggedIn = (req, res, next) => {
  
    if (req.user) {
     next();
    } else {
        res.sendStatus(401);
    }
}

Router.use(passport.initialize());
Router.use(passport.session());







Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


Router.get('/google/callback',  passport.authenticate('google', {failureRedirect:"/failed"}),
function(req,res){
  res.redirect("/good");
}
 
)

Router.get('/failed', (req, res) => res.send('You Failed to log in!'))


Router.get('/good', isLoggedIn, (req, res) =>{
    res.render("pages/profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})})


Router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


// Router.post("/good",async(req,res)=>{
//   try{
//           const {
//               uname,
//               email,
//               password,
//               cpassword
//           }=req.body;
          
//                              const  userData = new HomeSchema({
//                               uname,
//                               email,
//                               password,
//                              })
//                              userData.save( err=>{
//                               if(err){
//                                   console.log(err)
//                               }else{
//                                 console.log("data saved")          
//                              }})
//                  }
  
// catch(e){
//   console.log(e)
// }})









module.exports = Router;