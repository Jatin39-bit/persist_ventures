const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    name: {
        type: String,
        required: true
    },
    bio:{
        type: String
    },
    avatar:{
        type: String,
        
    },
    likedMemes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meme"
    }],
});

userSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.SECRET, {
        expiresIn: '24h'
    });
}

userSchema.methods.verifyToken = function(token){
    return jwt.verify(token, process.env.SECRET);
}

module.exports = mongoose.models.User || mongoose.model("User", userSchema)