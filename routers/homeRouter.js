const express = require("express");
const Router  = express.Router();
require('dotenv').config();
const HomeSchema = require("../models/userSchema");
const PaymentSchema = require("../models/payment-data");
require("../passport-setup")
const cookieSession = require('cookie-session')
const passport =require("passport");
const bodyParser = require("body-parser");
Router.use(bodyParser.json()) // for parsing application/json
Router.use(bodyParser.urlencoded({ extended: true }))



const Razorpay = require('razorpay')

const razorpay = new Razorpay({
key_id: "rzp_test_iQsqC7JbMx1RM2",
key_secret: "CTtqBiR4a8g9hxgirSeJqgzX"
})


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


Router.post("/good",async(req,res)=>{
  try{
          const {
              name,
              email,
              year
          }=req.body;
          
                             const  userData = new HomeSchema({
                              name,
                              email,
                              year
                             })
                             userData.save( err=>{
                              if(err){
                                  console.log(err)
                              }else{
                                console.log("data saved")
                                res.render("pages/payment",{name:req.user.displayName})          
                             }})
                 }
  
catch(e){
  console.log(e)
}})


Router.post('/order', (req, res) => {
  let options = {
  amount: 50000,
  currency: "INR",
  };
  razorpay.orders.create(options, function (err, order) {
  console.log(order)
  res.json (order)
  })
  })


  // Router.post('/is-order-complete', (req, res) => {

  //   razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
  //   if(paymentDocument.status == "captured")
  //   {res.send('Payment successful")}
  //   else{res.redirect('/')}
  // })
  //   })
Router.post("/is-order-complete" ,(req,res)=>{
  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
    if(paymentDocument.status == "captured")
    {
    
    const orderId= req.body.razorpay_order_id
    const name = req.body.name
//  HomeSchema.updateOne({name:req.body.name},{
//         $set:{"orderId":orderId}})
    const  userData1 = new PaymentSchema({
      orderId,
      name
     })
     userData1.save( err=>{
          if(err){
              console.log(err)
          }else{
            console.log("orderdata saved")
                    
         }})
         res.send("Payment successful")



 
  }
    else{res.send('failed')}
  })

})


module.exports = Router;