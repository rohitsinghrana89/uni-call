import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // Note: In production authentication, hash password with bcrypt
      created_At: new Date(),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        created_At: newUser.created_At,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error registering user", error: String(error) },
      { status: 500 }
    );
  }
}
