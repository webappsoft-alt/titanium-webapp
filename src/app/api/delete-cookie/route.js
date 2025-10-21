import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name } = await req.json();

    const response = NextResponse.json({
      success: true,
      message: "Cookie deleted successfully",
    });

    response.cookies.delete(name);

    return response;
  } catch (error) {
    console.error("Error deleting cookie:", error);
    return NextResponse.json({
      success: false,
      message: "Error deleting cookie",
    });
  }
}
