import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, value } = await req.json();

    const response = NextResponse.json({
      success: true,
      message: "Cookie set successfully",
    });

    response.cookies.set(name, value, {
      httpOnly: true,
      sameSite: "lax",
      priority: "high",
      path: "/",
      maxAge: 60 * 60 * 24, // ⏱️ 7 days
    });

    return response;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json({
      success: false,
      message: "Error setting cookie",
    });
  }
}
