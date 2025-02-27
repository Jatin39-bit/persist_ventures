import { NextResponse } from "next/server";
import memeModel from '@/models/meme.model.js'
import connect from '@/app/dbConfig/dbconfig'   

connect()


export async function GET(request) {
    try {
        const {searchParams}=new URL(request.url)
        const query=searchParams.get('category')
        const sortt=searchParams.get('sort')
        if(!query){
            const memes= await memeModel.find()
            return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
        }else{
            if(query === "random" && sortt === null || undefined || "" ){
                const memes= await memeModel.find()
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }else if(query === "random" && sortt === "mostRecent"){
                const memes= await memeModel.find().sort({createdAt:-1})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }else if(query === "random" && sortt === "mostLiked"){
                const memes= await memeModel.find().sort({likes:-1})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }
            else if(query === "random" && sortt === "comments"){
                const memes= await memeModel.find().sort({comments:-1})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }else if(sortt === "mostLiked"){
                const memes= await memeModel.find({category:query}).sort({likes:-1})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }else if(sortt === "comments"){
                const memes= await memeModel.find({category:query}).sort({comments:-1})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }
            else{
                const memes= await memeModel.find({category:query})
                return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
            }
        }
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}