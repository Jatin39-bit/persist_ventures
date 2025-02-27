import connect from "@/app/dbConfig/dbconfig";
import memeModel from "@/models/meme.model";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        const memes= await memeModel.find().sort({likes:-1, comments:-1}).limit(10)
        if(!memes){
            return NextResponse.json({ message: "No memes found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Leaderboard fetched successfully", topMemes:memes }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}