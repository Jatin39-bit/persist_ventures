import userModel from '@/models/user.model';
import { NextResponse } from 'next/server';
import  connect  from '@/app/dbConfig/dbconfig';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

connect();



export async function POST(request) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Please fill in all fields" }, { status: 400 });
        }
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return NextResponse.json({ message: "Wrong Email" }, { status: 400 });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Wrong password" }, { status: 400 });
        }
        if (!process.env.SECRET) {
            throw new Error("TOKEN_SECRET is not defined");
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "24h" });
        delete user.password;
        const response = NextResponse.json({message:"Logged in successfully", token,user }, { status: 200 });
        response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
        return response;
}
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
