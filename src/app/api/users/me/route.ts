import User from "@/models/UserModel";
import { NextResponse, NextRequest } from "next/server";
import { getDataFromToken } from "@/utils/GetDataFromToken";
import connectToDatabase from "@/dbconnect/connectToDatabase";

connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User Found", user, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
