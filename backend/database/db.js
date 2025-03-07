const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB =  () => {
    mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true, 
            useUnifiedTopology: true 
    }
    ).then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log('Database connection error', err);
    });
};

module.exports = connectDB