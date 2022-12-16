const express = require("express");
const Router  = express.Router();
require('dotenv').config();
const HomeSchema = require("../models/userSchema");
const PaymentSchema = require("../models/payment-data");
require("../passport-setup")
const cookieSession = require('cookie-session')
const passport =require("passport");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
Router.use(bodyParser.json()) // for parsing application/json
Router.use(bodyParser.urlencoded({ extended: true }))
const Razorpay = require('razorpay')

const transporter = nodemailer.createTransport({
  service:"hotmail",
  auth :{
      user: "shankarjatin1005@outlook.com",
      pass: "Jatin@1003j"
  }
})







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
              branch,
              student_no,
              roll_no,
              year
          }=req.body;
          


                             const usermail = await HomeSchema.findOne({email:email}) 
                             if(usermail){res.render("pages/userexist")}
                           else { 
                            
                            const  userData = new HomeSchema({
                              name,
                              email,
                              branch,
                              student_no,
                              roll_no,
                              year
                             })
                             userData.save( err=>{
                              if(err){
                                  console.log(err)
                              }else{
                                console.log("data saved")
                                // res.render("pages/review",{name:req.user.displayName}) 
                                var user = HomeSchema.find({name})
                                user.exec(function(err,data){
                                  if(err){console.log(err)}
                                  else{
                                    console.log(data)
                                  }
                                })

                                const useremail = HomeSchema.findOne({email:email})
                                    const options1 ={
                                        from: "shankarjatin1005@outlook.com",
                                        to: req.body.email,
                                        subject: "Registration Notification!",
                                       html:'<h1>You have been Registered</h1><br><h1>Welcome !</h1>'
                                    
                                        };
                                      
                                            transporter.sendMail(options1,  (err, info)=> {
                                                if(err){
                                                console.log(err);
                                                return;
                                                }
                                                console.log("Sent: " + info.response);
                                                })

                                res.render("pages/payment",{name:req.user.displayName,year:year,email:email,year:year,branch:branch,student_no:student_no,roll_no:roll_no}) 
                             
                              
                             }})}
         }
  
catch(e){
  console.log(e)
}})

Router.get("/order",(req,res)=>{
  res.render("pages/payment",{name:req.user.displayName}) 
})
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
Router.post("/is-order-complete" ,isLoggedIn,(req,res)=>{
  razorpay.payments.fetch(req.body.razorpay_payment_id).then((paymentDocument) => {
    if(paymentDocument.status == "captured")
    {
      
      const name = req.user.displayName
    const orderId= req.body.razorpay_order_id
    const email = req.user.emails[0].value
    const paymentStatus=paymentDocument.status
    // HomeSchema.orderId.aggregate( [
    //   {
    //     $addFields: { "orderId": orderId }
    //   }
    // ] )
    // const email=req.user.emails[0].value
 HomeSchema.updateOne({"name":name},{
        $set:{"orderId":orderId}})
    const  userData1 = new PaymentSchema({
      orderId,
      name,
      email,
      paymentStatus

     
     })
     userData1.save( err=>{
          if(err){
              console.log(err)
          }else{
            console.log("orderdata saved")
                    
         }})
        //  res.send("Payment successful")
        res.render("pages/paymentDone",{name:req.user.displayName, orderId:orderId})
        const options1 ={
          from: "shankarjatin1005@outlook.com",
          to: req.user.emails[0].value,
          subject: "Payment Notification!",
         html:'<h1>Payment Successful! and You have been Registered</h1><br><h1>Welcome !</h1>'
      
          };
        
              transporter.sendMail(options1,  (err, info)=> {
                  if(err){
                  console.log(err);
                  return;
                  }
                  console.log("Sent: " + info.response);
                  })


 
  }
    else{res.send('failed')}
  })

})


module.exports = Router;