import { NextResponse } from "next/server";
import memeModel from '@/models/meme.model.js'
import connect from '@/app/dbConfig/dbconfig'   

connect()

export async function GET(request) {
    try{
        const {searchParams}=new URL(request.url)
        const q=searchParams.get('q')
        if(!q){
            return NextResponse.json({ message: "Please provide a search query" }, { status: 400 });
        }
        const memes= await memeModel.find({name: { $regex: q, $options: 'i' }})
        return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
    }catch(error){
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
