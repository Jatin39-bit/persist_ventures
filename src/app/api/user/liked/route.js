import connect from "@/app/dbConfig/dbconfig";
import userModel from "@/models/user.model";
import { NextResponse } from "next/server";
import { userAuth } from "@/middleware/authenticate";

connect();

export async function GET(request) {
    try {
        const user = await userAuth(request);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const completeUser = await userModel.findOne({ _id: user._id }).populate("likedMemes");
        if (!completeUser) {
            return NextResponse.json({ message: "No liked memes found" }, { status: 404 });
        }
        const memes= completeUser.likedMemes;
        return NextResponse.json({ message: "Liked memes fetched successfully", memes }, { status: 200 });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });       
    }
}