import { NextResponse } from "next/server";
import connect from '@/app/dbConfig/dbconfig' 
import { userAuth } from "@/middleware/authenticate";  
import userModel from "@/models/user.model";

connect()

export async function GET(request,{params}) {
    try{
        const user= await userAuth(request)
        const id = (await params).id
        if(!id){
            return NextResponse.json({ message: "Please provide an id" }, { status: 400 });
        }
        const meme= await userModel.findOne({ _id: user._id, likedMemes: id })
        if(meme){
            return NextResponse.json({ message: "Meme already liked", liked: true }, { status: 200 });
        }
        return NextResponse.json({ message: "Meme not liked", liked: false }, { status: 200 });
    }catch(error){
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}