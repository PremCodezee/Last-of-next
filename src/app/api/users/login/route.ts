import connectToDatabase from "@/dbconnect/connectToDatabase";
import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", error: null },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password", error: null },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    user.isLogin = true;
    await user.save();

    // Set the token in cookies
    const response = NextResponse.json(
      { message: "Login successful", user },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
