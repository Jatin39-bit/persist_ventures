const memeModel = require('../models/meme.model');
const { validationResult } = require('express-validator');
const userModel = require('../models/user.model');



module.exports.getMemeById = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = await memeModel.findById(id);
        if(!meme){
            return res.status(404).json({message: "Meme not found"});
        }
        return res.status(200).json({message: "Meme found",meme});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}


module.exports.postComment = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()[0].msg});
        }
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = await memeModel.findById(id);
        if(!meme){
            return res.status(404).json({message: "Meme not found"});
        }
        const comment = req.body.text;
        meme.commentArray.push(comment)
        await meme.save();
        return res.status(200).json({message: "Comment added successfully",meme});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports.likeMeme = async (req, res) => {
    try{
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = await memeModel.findById(id);
        if(!meme){
            return res.status(404).json({message: "Meme not found"});
        }
        const user = await userModel.findOne({_id: req.user._id, likedMemes: id});
        if(user){
            return res.status(400).json({message: "Meme already liked"});
        }
        await userModel.updateOne({_id: req.user._id}, {$push: {likedMemes: id}});
        await memeModel.updateOne({_id: id}, {$inc: {likes: 1}});
        
        return res.status(200).json({message: "Meme liked successfully",liked:true});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}


module.exports.getLikeStatus = async (req, res) => {
    try{
        const user= req.user;
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = await userModel.findOne({_id: user._id, likedMemes: id});
        if(meme){
            return res.status(200).json({message: "Meme already liked",liked:true});
        }
        return res.status(200).json({message: "Meme not liked",liked:false});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports.unlikeMeme = async (req, res) => {
    try{
        const user = req.user;
        const id = req.params.id;
        if(!id){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = await memeModel.findById(id);
        if(!meme){
            return res.status(404).json({message: "Meme not found"});
        }
        const user1 = await userModel.findOne({_id: req.user._id, likedMemes: id});
        if(!user1){
            return res.status(400).json({message: "Meme not liked"});
        }
        await userModel.updateOne({_id: req.user._id}, {$pull: {likedMemes: id}});
        await memeModel.updateOne({_id: id}, {$inc: {likes: -1}});

        return res.status(200).json({message: "Meme unliked successfully",liked:false});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}


module.exports.getLeaderboard = async (req, res) => {
    try{
        const memes= await memeModel.find().sort({likes:-1, comments:-1}).limit(10);
        if(!memes){
            return res.status(404).json({message: "No memes found"});
        }
        return res.status(200).json({message: "Leaderboard found",topMemes:memes});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports.searchMemes = async (req, res) => {
    try{
        const query = req.query.q;
        if(!query){
            return res.status(400).json({message: "Invalid request"});
        }
        const memes = await memeModel.find({name: { $regex: query, $options: 'i' }});
        if(!memes){
            return res.status(404).json({message: "No memes found"});
        }
        return res.status(200).json({message: "Memes found",memes});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}


module.exports.uploadMeme = async (req, res) => {
    try{
        const user = req.user;
        if(!user){
            return res.status(400).json({message: "Invalid request"});
        }
        const {url,name,category,uploadedBy} = req.body;
        if(!url || !name || !category || !uploadedBy){
            return res.status(400).json({message: "Invalid request"});
        }
        const meme = new memeModel({url,name,category,uploadedBy,height:500,width:500});
        await meme.save();
        return res.status(200).json({message: "Meme uploaded successfully"});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports.getUploadedMemes = async (req, res) => {
    try{
        const user = req.user;
        if(!user){
            return res.status(400).json({message: "Invalid request"});
        }
        const memes = await memeModel.find({uploadedBy: user.email});
        if(!memes){
            return res.status(404).json({message: "No memes found"});
        }
        return res.status(200).json({message: "Memes found",memes});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

module.exports.getFeed = async (req, res) => {
    try{
        const {category,sort}=req.query;
        if(!category && !sort){
            return res.status(400).json({message: "Invalid request"});
        }else{
            if(category === "random" && sort === null || undefined || "" ){
                const memes= await memeModel.find()
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }else if(category === "random" && sort === "mostRecent"){
                const memes= await memeModel.find().sort({createdAt:-1})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }else if(category === "random" && sort === "mostLiked"){
                const memes= await memeModel.find().sort({likes:-1})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }
            else if(category === "random" && sort === "comments"){
                const memes= await memeModel.find().sort({comments:-1})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }else if(sort === "mostLiked"){
                const memes= await memeModel.find({category:category}).sort({likes:-1})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }else if(sort === "comments"){
                const memes= await memeModel.find({category:category}).sort({comments:-1})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }
            else{
                const memes= await memeModel.find({category:category})
                return res.status(200).json({ message: "Memes fetched successfully", memes });
            }
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message: err.message});
    }
}