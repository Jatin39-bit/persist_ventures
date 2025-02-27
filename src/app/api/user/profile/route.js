import { NextResponse } from "next/server";
import { userAuth } from "@/middleware/authenticate";

export async function GET(request) {
try {
    const user = await userAuth(request);
    if(!user || user === undefined || user === null){
        return NextResponse.json({ message: "Unauthorized" }, { status: 400});
    }else{
    return NextResponse.json({ message: "Authorized", user }, { status: 200 });
    }
} catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
}
}

export async function PUT(request) {
try {
    const user = await userAuth(request);
    if(!user || user === undefined || user === null){
        return NextResponse.json({ message: "Unauthorized" }, { status: 400});
    }
    const {name, bio}= await request.json();
    user.name = name;
    user.bio = bio;
    await user.save();
    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });
} catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
}   
}