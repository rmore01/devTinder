const express = require('express');
const bcrypt = require('bcrypt');
const { validateSignup } = require('../utils/validate.js');
const user = require('../models/user.js');
const authRouter = express.Router();

//signup api
authRouter.post('/signup', async (req,res) =>{

    try
    {
    const { firstName, lastName, emailId, password} = req.body;

    validateSignup(req);
    const passwordhash = await bcrypt.hash(password,10);
    const User = new user({
        firstName,
        lastName,
        emailId,
        password:passwordhash
    });
    await User.save();
        res.send('user added successfully...')
    }
    catch(err){
        res.status(400).send('error in saving data' + err.message);
    }
});

//login api

authRouter.get('/login', async(req,res) =>{
    try{
        const { emailId, password} = req.body;

        const userData = await user.findOne({emailId:emailId});
        if(!userData){
            throw new Error('invalid credentials')
        }
        const isPasswordMatch = await userData.validatePassword(password);
        if (!isPasswordMatch){
            throw new Error('invalid credentials');
        }
        else{
            const token = await userData.getjwt();
            console.log(token);
            res.cookie('token',token,{
                expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
            });
            res.send('Login Successful!!!')
        }
    }
    catch(err){
            res.status(400).send('login failed ' + err.message);
        }
});

authRouter.post('/logout', (req,res) =>{
    res.cookie('token', null, {
        expires: new Date(Date.now())
    });
    res.send('User has been logged out!!!');
})

module.exports = authRouter;