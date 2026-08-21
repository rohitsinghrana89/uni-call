import { NextResponse } from "next/server";
import { createMeeting, listMeetings } from "@/lib/meetings";

export async function GET() {
  try {
    const meetings = listMeetings();
    return NextResponse.json({
      success: true,
      meetings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch meetings", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: { title?: string; host?: string; customId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // Body might be empty, proceed with defaults
    }

    const meeting = createMeeting(body.title, body.host, body.customId);

    // Build absolute URL if origin is present in request headers
    const hostHeader = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${hostHeader}`;
    const fullUrl = `${baseUrl}${meeting.url}`;

    return NextResponse.json(
      {
        success: true,
        meeting: {
          ...meeting,
          fullUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create meeting", error: String(error) },
      { status: 500 }
    );
  }
}
