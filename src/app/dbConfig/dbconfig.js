import mongoose from 'mongoose';

export default function connect(){
    if(mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise()
    }
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL is not defined in the environment variables");
        }
        mongoose.connect(mongoUrl).then(() => console.log("connected to database"));
    } catch (error) {
        console.log('error:',error)
    }
}