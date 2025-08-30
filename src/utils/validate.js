const validator = require('validator');

const validateSignup = (req) =>{

    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("name is not valid!");
    }
    else if (!validator.isEmail(emailId)){
         throw new Error("email id is not valid!");
    }
    else if (!validator.isStrongPassword(password)){
         throw new Error("Please enter strong password!");
    }
}

const validateProfileData = (req) =>{
        const allowedEdits = ["firstName", "lastName","emailId", "gender", "age", "skills", "photoUrl"];
        const isEditallowed = Object.keys(req.body).every((k) => allowedEdits.includes(k));
        return isEditallowed;
}

const validateNewPassword = (req) =>{
     const { newPassword, confirmPassword } = req.body;
        if(!validator.isStrongPassword(newPassword) || !validator.isStrongPassword(confirmPassword)){
            throw new Error('Enter strong password!')
        }
        else if(newPassword !== confirmPassword){
            throw new Error('password not matching')
        }
}
module.exports = {
    validateSignup,
    validateProfileData,
    validateNewPassword
}