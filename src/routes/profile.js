const express = require('express');
const { userAuth } = require('../middlewares/auth.js');
const user = require('../models/user.js');
const { validateProfileData, validateNewPassword } = require('../utils/validate.js');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

//profile api

profileRouter.get('/profile/view', userAuth, async(req,res) =>{
    try{
        const User  = req.user;
        res.send(User);
    }
    catch(err){
            res.status(400).send('profile error ' + err.message);
        }
})

profileRouter.patch('/profile/edit', userAuth, async(req,res) =>{
    try{
        if(!validateProfileData(req)){
            throw new Error('invalid edit request');
        }
        const loggedInUserData  = req.user;
        Object.keys(req.body).forEach((key)=> loggedInUserData[key] = req.body[key]);
        await loggedInUserData.save();
        res.json({message:`${loggedInUserData.firstName} ,your profile updated successfully`,
            data:loggedInUserData
        });
        
    }
    catch(err){
            res.status(400).send('profile error ' + err.message);
        }
})

//forget password
profileRouter.patch('/profile/password',userAuth, async(req,res)=>{
    try{
    validateNewPassword(req);
    const { newPassword } = req.body;
    const loggedInUser = req.user;
    const passwordHash = await bcrypt.hash(newPassword,10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    res.json({ message: `${loggedInUser.firstName}, your password has been successfully updated `})
    }
    catch(err){
            res.status(400).send('error ' + err.message);
        }
})
module.exports = profileRouter;