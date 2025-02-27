import { NextResponse } from "next/server";
import memeModel from "@/models/meme.model.js";
import connect from "@/app/dbConfig/dbconfig";

connect();

export async function GET(request,{params}) {
  try {
    const id = (await params).id
    if (!id) {
      return NextResponse.json(
        { message: "Please provide an id" },
        { status: 400 }
      );
    } else {
      const meme = await memeModel.findById(id);
      return NextResponse.json(
        { message: "Meme fetched successfully", meme },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
