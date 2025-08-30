
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema= new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        minLength:4,
        maxLength:50
    },
    lastName:{
        type:String,
        minLength:4,
        maxLength:50
    },
    emailId:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("invalid email address")
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error("please enter strong password")
            }
        }
    },
    age:{
        type:Number,
        min:10,
        max:25
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','other'].includes(value)){
                throw new Error('the gender you entered is not a valid')
            }
        }
    },
    skills:{
        type:[String],
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNKfj6RsyRZqO4nnWkPFrYMmgrzDmyG31pFQ&s",
        validate(value){
            if (!validator.isURL(value)){
                throw new Error("please enter valid url")
            }
        }
    }
},{
    timestamps: true
});
userSchema.methods.getjwt = async function () {
    const user = this;
    const token = await jwt.sign({_id:user._id},'Dev@Tinder$123',{expiresIn:'1d'});
    return token;
    
}

userSchema.methods.validatePassword = async function (passwordinputbyuser) {
    const user = this;
    const passwordHash = user.password;
    const ispasswordvalid = await bcrypt.compare(passwordinputbyuser,passwordHash);
    return ispasswordvalid;
    
}

module.exports = mongoose.model("User", userSchema);