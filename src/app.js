var express = require('express');


var app =  express();

app.use("/test",(req,res)=>{
    res.send("hello from server");
});
app.use("/hello",(req,res)=>{
    res.send("hello from dashboard");
});

app.listen(3000, () =>{
    console.log("server is running on port 3000");
});