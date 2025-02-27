import mongoose from "mongoose";

const memeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["trending", "new", "classic"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    createdAt:{
      type:Date,
      default:Date.now()
    },
    commentArray:[
      {
        type:String
      }
    ]
    
  },
);

export default mongoose.models.Meme || mongoose.model("Meme", memeSchema);
