const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    },
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User",
    },
    status:{
        type: String,
        enum:{
            values: ['ignored','interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps:true
    }
);

connectionRequestSchema.index({toUserId:1, fromUserId:1});

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('You cannot send connection request to yourself!!!');
    }
    next();
})



module.exports = mongoose.model('connectionRequest', connectionRequestSchema);