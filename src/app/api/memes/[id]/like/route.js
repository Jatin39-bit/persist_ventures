import connect from "@/app/dbConfig/dbconfig";
import { userAuth } from "@/middleware/authenticate";
import userModel from "@/models/user.model";
import memeModel from "@/models/meme.model";
import { NextResponse } from "next/server";

connect();

export async function POST(request, { params }) {
    try {
        const user = await userAuth(request);
        const id = (await params).id;
        if (!id) {
        return NextResponse.json({ message: "Please provide an id" }, { status: 400 });
        }
        const meme = await memeModel.findOne({ _id: id });
        if (!meme) {
        return NextResponse.json({ message: "Meme not found" }, { status: 404 });
        }
        const user1 = await userModel.findOne({ _id: user._id, likedMemes: id });
        if (user1) {
        return NextResponse.json({ message: "Meme already liked", liked: true }, { status: 200 });
        }
        await userModel.updateOne({ _id: user._id }, { $push: { likedMemes: id } });
        await memeModel.updateOne({ _id: id }, { $inc: { likes: 1 } });
        return NextResponse.json({ message: "Meme liked successfully", liked: true }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    }