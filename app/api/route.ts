import { connectToDatabase } from "@/Lib/db";
import User from "@/Models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
       
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }
         await connectToDatabase();
         const existingUser = await User.findOne({ email });
         if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
         }
          await User.create({ email, password }); 
          return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    }
  
    catch (error) {
        console.error("Error in POST /api:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}