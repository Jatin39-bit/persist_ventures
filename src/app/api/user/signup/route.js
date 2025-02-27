import  connect  from "@/app/dbConfig/dbconfig.js";
import userModel from "@/models/user.model.js";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


connect();

export async function POST(request) {
try {
    const { email, name, password } = await request.json();
        console.log(email, name, password);
    if (!email || !name || !password) {
        return NextResponse.json({ message: "Please fill in all fields" }, { status: 400 });
    }
    const user = await userModel.findOne({ email });
    if (user) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ email, name, password: hashedPassword });
    const token = newUser.generateToken();
    await newUser.save();

    delete newUser.password;

    return NextResponse.json({ message: "User created successfully", token,newUser}, { status: 200 });


} catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
}
}
