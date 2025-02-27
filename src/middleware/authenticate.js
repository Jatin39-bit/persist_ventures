import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import userModel from '@/models/user.model.js'
import connect from '@/app/dbConfig/dbconfig'
import { cookies } from 'next/headers'

connect()


export const userAuth= async (request) => {
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");
    if (!userId || !userEmail || userId === null || userEmail === null || userId === "" || userEmail === "") {   
        const token= (await cookies(request)).get("token")?.value || request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 400});
        }
        try{
            const decoded = jwt.verify(token, process.env.SECRET);
            if (!decoded) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 400});
            }
            const user= await userModel.findById(decoded.id)
            if (!user) {
                return NextResponse.json({ message: "Unauthorized" }, { status: 400});
            }
            return user
    }
        catch(error){
            console.log(error.message);
            return NextResponse.json({ message: "Unauthorized" }, { status: 400});
        }
    }
}


