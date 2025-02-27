import connect from "@/app/dbConfig/dbconfig";
import { userAuth } from "@/middleware/authenticate";
import memeModel from "@/models/meme.model";
import { NextResponse } from "next/server";

connect();

export async function POST(request, { params }) {
    try {
        const user = await userAuth(request);
        const id = (await params).id;
        const { text }= await request.json();
        if (!id) {
        return NextResponse.json({ message: "Please provide an id" }, { status: 400 });
        }
        const meme = await memeModel.findOne({ _id: id });
        if (!meme) {
        return NextResponse.json({ message: "Meme not found" }, { status: 404 });
        }
        meme.commentArray.push(text);
        await meme.save();
        return NextResponse.json({ message: "Comment added successfully", meme }, { status:200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    }