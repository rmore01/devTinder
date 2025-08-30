const express = require('express');
const { userAuth } = require('../middlewares/auth.js');
const user = require('../models/user.js');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connecionrequest.js');


//send connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) =>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"]
        if(!allowedStatus.includes(status)){
            throw new Error('status should be ignored or interested')
        }

        const toUser = await user.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message:'User does not exists'
            })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[{
                toUserId,fromUserId
            },
            {
                toUserId:fromUserId, fromUserId:toUserId
            }
        ],
        });
        if(existingConnectionRequest){
             return res.status(400).json({
                message:'connection request already sent to this user id'
            })
        }
        const connectionRequest = new ConnectionRequest(
            {
                toUserId,
                fromUserId,
                status
            }
        )


        const data = await connectionRequest.save();
        res.json({
            message:'connection request successfully sed to the user',
            data
        })
    }
    catch(err){
        res.status(400).send('Error: ' + err.message)
    }
    
});

//POST API TO ACCEPT OR REJECT API
requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res)=>{
    try{
        const { status, requestId } = req.params;
        const loggedInUser = req.user;

        const allowedStatus = ["accepted", "rejected"];
        
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:'Status not allowed!'
            })
        }

        const connecionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });

        if(!connecionRequest){
             return res.status(400).json({
                message:'Connection request not found!'
            })
        }

        connecionRequest.status = status;
        const data = await connecionRequest.save();

            res.json({
                message:'status of this Connection request changed!',
                data
            })
    }
    catch(err){
        res.status(400).send('Error: ' + err.message)
    }
})

module.exports = requestRouter;