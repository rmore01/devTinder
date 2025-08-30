var express = require('express');
const connectDB = require('./config/database.js');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');


var app =  express();

app.use(express.json());
app.use(cookieParser());


app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);


connectDB().then(() =>{
console.log('database connection established...');
app.listen(7777, () =>{
    console.log("server is running on port 7777");
});
}).catch((err) =>{
    console.log('database cannot connected....')
});


