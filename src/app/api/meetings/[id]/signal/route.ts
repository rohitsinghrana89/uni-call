import { NextResponse } from "next/server";
import {
  registerPeer,
  unregisterPeer,
  updatePeerState,
  postSignalMessage,
  getRoomSignalsForPeer,
} from "@/lib/signaling";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const peerId = url.searchParams.get("peerId") || "";
    const since = parseInt(url.searchParams.get("since") || "0", 10);

    const result = getRoomSignalsForPeer(id, peerId, since);

    return NextResponse.json({
      success: true,
      peers: result.peers,
      signals: result.signals,
      serverTime: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error polling signals", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, peerId, displayName, micEnabled, camEnabled, isScreenSharing, toPeerId, type, payload } = body;

    if (!peerId) {
      return NextResponse.json(
        { success: false, message: "peerId is required" },
        { status: 400 }
      );
    }

    if (action === "join") {
      const peers = registerPeer(
        id,
        peerId,
        displayName || "Guest",
        !!micEnabled,
        !!camEnabled,
        !!isScreenSharing
      );
      return NextResponse.json({ success: true, action: "joined", peers, serverTime: Date.now() });
    }

    if (action === "leave") {
      unregisterPeer(id, peerId);
      return NextResponse.json({ success: true, action: "left", serverTime: Date.now() });
    }

    if (action === "state-change") {
      updatePeerState(id, peerId, !!micEnabled, !!camEnabled, !!isScreenSharing);
      return NextResponse.json({ success: true, action: "state-updated", serverTime: Date.now() });
    }

    if (action === "signal" && type && toPeerId) {
      postSignalMessage(id, peerId, toPeerId, type, payload);
      return NextResponse.json({ success: true, action: "signal-queued", serverTime: Date.now() });
    }

    return NextResponse.json(
      { success: false, message: "Invalid signal action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error posting signal", error: String(error) },
      { status: 500 }
    );
  }
}
