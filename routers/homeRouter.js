const express = require("express");
const Router  = express.Router();
require('dotenv').config();
// const HomeSchema = require("../models/homeSchema");
require("../passport-setup")
const passport =require("passport");


Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));




module.exports = Router;