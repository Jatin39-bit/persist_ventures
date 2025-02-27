import memeModel from "@/models/meme.model";
import connect from "@/app/dbConfig/dbconfig";
import { NextResponse } from "next/server";
import { userAuth } from "@/middleware/authenticate";

connect();

export async function GET(request) {
    try {
        const user= await userAuth(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        const memes = await memeModel.find({ uploadedBy: user.email });
        if (!memes) {
            return NextResponse.json({ message: "No memes found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Memes fetched successfully", memes }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}