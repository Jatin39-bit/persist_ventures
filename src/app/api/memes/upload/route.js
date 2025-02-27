import { userAuth } from "@/middleware/authenticate";
import memeModel from "@/models/meme.model";
import { NextResponse } from "next/server";
import connect from "@/app/dbConfig/dbconfig";

connect();

export async function POST(request) {
    try {
        const user = await userAuth(request);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
        }
        const {url, category, name,uploadedBy} = await request.json();
        console.log(url, category, name,uploadedBy)
        if (!url || !category || !name || !uploadedBy) {
            return NextResponse.json({ message: "Please provide all the fields" }, { status: 400 });
        }
        const meme = new memeModel({
            url,
            category,
            name,
            uploadedBy,
            height:500,
            width:500,
        });
        await meme.save();
        return NextResponse.json({ message: "Meme uploaded successfully" }, { status: 200});

    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "Unauthorized" }, { status: 400 });
    }
    }