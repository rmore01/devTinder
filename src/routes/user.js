const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnecionRequest = require('../models/connecionrequest');
const userRouter = express.Router();
const User = require('../models/user');

const USER_SAVED_DATA = "firstName lastName photoUrl age gender"
userRouter.get('/user/requests/received',userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnecionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", ["firstName","lastName","photoUrl","age","gender"]);

        if(!connectionRequests.length){
            return res.status(200).json({
                message:'There is no new connection requests!!!'
            })
        }

        res.json({
            message:'Data fetched successfully!!!',
            data:connectionRequests
        })
    }
    catch(err){
        res.status(400).send('Error:' + err.message);
    }
})


//get all connections
userRouter.get('/user/connections', userAuth, async(req,res) =>{
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnecionRequest.find({
            $or:[
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAVED_DATA).populate("toUserId",USER_SAVED_DATA);
        

        const data =connectionRequest.map(x=> {
            if(x.fromUserId._id.toString() === loggedInUser._id.toString()){
                return x.toUserId
            }
            return x.fromUserId
    });

        res.json({
            message:'Connection requests',
            data
        })
    }
    catch(err){
        res.status(400).send("Error:" + err);
    }
})

userRouter.get('/feed', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page -1) * limit;

        const connectionRequest = await ConnecionRequest.find({
            $or:[
                {
                    fromUserId: loggedInUser._id
                },{
                    toUserId:loggedInUser._id
                }
            ]
        }).select("fromUserId toUserId");

        const hideUserAccounts = new Set();
        connectionRequest.forEach(req =>{
            hideUserAccounts.add(req.fromUserId);
            hideUserAccounts.add(req.toUserId);
        });

        const users = await User.find({
            $and:[
                {_id: { $nin: Array.from(hideUserAccounts) } },
                {_id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAVED_DATA).skip(skip).limit(limit);

        res.json({data:users})
    }
    catch(err){
        res.status(400).send("Error:" + err);
    }
})

module.exports = userRouter;