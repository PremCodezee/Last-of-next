import connectToDatabase from "@/dbconnect/connectToDatabase";
import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";

connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { name, email, password } = reqBody;

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        {
          message: "User already exists",
          error: null,
        },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "User created successfully",
        registered_user: savedUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
