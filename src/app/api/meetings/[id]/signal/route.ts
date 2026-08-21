import { NextResponse } from "next/server";
import {
  registerPeer,
  unregisterPeer,
  updatePeerState,
  postSignalMessage,
  getRoomSignalsForPeer,
  hostMutePeer,
  hostStopScreenSharePeer,
  hostRemovePeer,
  hostToggleLock,
  hostEndMeeting,
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
      isLocked: result.isLocked,
      isEnded: result.isEnded,
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
    const { action, peerId, displayName, micEnabled, camEnabled, isScreenSharing, isHost, toPeerId, type, payload } = body;

    if (!peerId) {
      return NextResponse.json(
        { success: false, message: "peerId is required" },
        { status: 400 }
      );
    }

    if (action === "join") {
      const regResult = registerPeer(
        id,
        peerId,
        displayName || "Guest",
        !!micEnabled,
        !!camEnabled,
        !!isScreenSharing,
        !!isHost
      );

      if (regResult.error) {
        return NextResponse.json(
          { success: false, message: regResult.error, isLocked: regResult.isLocked, isEnded: regResult.isEnded },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "joined",
        peers: regResult.peers,
        isLocked: regResult.isLocked,
        isEnded: regResult.isEnded,
        serverTime: Date.now(),
      });
    }

    if (action === "leave") {
      unregisterPeer(id, peerId);
      return NextResponse.json({ success: true, action: "left", serverTime: Date.now() });
    }

    if (action === "state-change") {
      updatePeerState(id, peerId, !!micEnabled, !!camEnabled, !!isScreenSharing, isHost);
      return NextResponse.json({ success: true, action: "state-updated", serverTime: Date.now() });
    }

    if (action === "signal" && type && toPeerId) {
      postSignalMessage(id, peerId, toPeerId, type, payload);
      return NextResponse.json({ success: true, action: "signal-queued", serverTime: Date.now() });
    }

    // --- Host Control Actions (Server-Verified) ---

    if (action === "host-mute") {
      const { targetPeerId } = body;
      const res = hostMutePeer(id, peerId, targetPeerId);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.error }, { status: 403 });
      }
      return NextResponse.json({ success: true, action: "host-muted", serverTime: Date.now() });
    }

    if (action === "host-stop-share") {
      const { targetPeerId } = body;
      const res = hostStopScreenSharePeer(id, peerId, targetPeerId);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.error }, { status: 403 });
      }
      return NextResponse.json({ success: true, action: "host-stopped-share", serverTime: Date.now() });
    }

    if (action === "host-remove") {
      const { targetPeerId } = body;
      const res = hostRemovePeer(id, peerId, targetPeerId);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.error }, { status: 403 });
      }
      return NextResponse.json({ success: true, action: "host-removed-peer", serverTime: Date.now() });
    }

    if (action === "host-toggle-lock") {
      const { isLocked } = body;
      const res = hostToggleLock(id, peerId, !!isLocked);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.error }, { status: 403 });
      }
      return NextResponse.json({ success: true, action: "host-toggled-lock", isLocked: res.isLocked, serverTime: Date.now() });
    }

    if (action === "host-end-meeting") {
      const res = hostEndMeeting(id, peerId);
      if (!res.success) {
        return NextResponse.json({ success: false, message: res.error }, { status: 403 });
      }
      return NextResponse.json({ success: true, action: "host-ended-meeting", serverTime: Date.now() });
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
