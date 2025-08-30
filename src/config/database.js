const mongoose = require('mongoose');

const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://ruchira:Ruchi%40123@namastenode.4kpiaci.mongodb.net/devTinder');
}

module.exports = connectDB;