const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const HomeSchema = require("./models/userSchema");
passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"https://hashes-registration-jatin.onrender.com/google/callback",
    // callbackURL:"http://localhost:5000/google/callback",
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done, ) {
    console.log(profile);
    return done(null,profile)
    // if(profile._json.domain !== "akgec.ac.in")
    // {      done(new Error("Wrong domain!"));
    // }
    // else{  
    //   console.log(profile);
    //   return done(null,profile)
    //  }
    
  }
    ))
