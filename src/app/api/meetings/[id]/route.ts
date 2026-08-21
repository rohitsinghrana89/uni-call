import { NextResponse } from "next/server";
import { getMeetingById, createMeeting } from "@/lib/meetings";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let meeting = getMeetingById(id);

    // If meeting doesn't exist yet, auto-register it so any valid meeting ID link opens cleanly
    if (!meeting) {
      meeting = createMeeting(`Meeting Room ${id.toUpperCase()}`, "Host", id);
    }

    const hostHeader = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${hostHeader}`;
    const fullUrl = `${baseUrl}/meeting/${meeting.id}`;

    return NextResponse.json({
      success: true,
      meeting: {
        ...meeting,
        fullUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching meeting details", error: String(error) },
      { status: 500 }
    );
  }
}
