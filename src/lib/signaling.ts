import { getMeetingById, setMeetingLocked, setMeetingStatus } from "./meetings";

export interface PeerInfo {
  peerId: string;
  displayName: string;
  micEnabled: boolean;
  camEnabled: boolean;
  isScreenSharing?: boolean;
  isHost?: boolean;
  joinedAt: number;
}

export interface SignalMessage {
  id: string;
  fromPeerId: string;
  toPeerId: string;
  type:
    | "offer"
    | "answer"
    | "ice-candidate"
    | "state-change"
    | "user-joined"
    | "user-left"
    | "force-mute"
    | "force-remove"
    | "force-stop-share"
    | "room-lock-changed"
    | "meeting-ended";
  payload?: any;
  timestamp: number;
}

interface RoomState {
  peers: Map<string, PeerInfo>;
  signals: SignalMessage[];
  hostPeerId?: string;
  isLocked?: boolean;
  isEnded?: boolean;
}

// Global in-memory WebRTC signaling store mapped by meeting ID
const rooms: Map<string, RoomState> = new Map();

function getOrCreateRoom(roomId: string): RoomState {
  const normalizedId = roomId.toUpperCase().trim();
  if (!rooms.has(normalizedId)) {
    rooms.set(normalizedId, {
      peers: new Map(),
      signals: [],
      isLocked: false,
      isEnded: false,
    });
  }
  return rooms.get(normalizedId)!;
}

/**
 * Server-side host permission verification check.
 * Strictly verifies whether the given peerId is the meeting creator/host.
 */
export function verifyHostPermission(roomId: string, requesterPeerId: string): boolean {
  const normalizedId = roomId.toUpperCase().trim();
  const room = rooms.get(normalizedId);
  if (!room) return false;

  const peer = room.peers.get(requesterPeerId);

  // 1. Explicitly recorded host peer ID in room state
  if (room.hostPeerId && room.hostPeerId === requesterPeerId) {
    return true;
  }

  // 2. Peer is explicitly flagged as host in room peers map
  if (peer && peer.isHost) {
    return true;
  }

  // 3. Match against server meeting store host name
  const meeting = getMeetingById(normalizedId);
  if (meeting && peer && peer.displayName) {
    const isMatchingHost = peer.displayName.trim().toLowerCase() === meeting.host.trim().toLowerCase();
    if (isMatchingHost) {
      room.hostPeerId = requesterPeerId;
      return true;
    }
  }

  return false;
}

/**
 * Registers or updates a peer in a meeting room.
 * Rejects non-host users if meeting room is locked by the host.
 */
export function registerPeer(
  roomId: string,
  peerId: string,
  displayName: string,
  micEnabled: boolean,
  camEnabled: boolean,
  isScreenSharing?: boolean,
  isHost?: boolean
): { peers: PeerInfo[]; isLocked?: boolean; isEnded?: boolean; error?: string } {
  const room = getOrCreateRoom(roomId);

  if (room.isEnded) {
    return { peers: [], isEnded: true, error: "This meeting has already been ended by the host." };
  }

  const meeting = getMeetingById(roomId);
  const isMatchingMeetingHost = meeting
    ? displayName.trim().toLowerCase() === meeting.host.trim().toLowerCase() || meeting.host === "Host"
    : false;

  const actualIsHost = !!isHost || isMatchingMeetingHost || room.peers.size === 0;

  if (room.isLocked && !actualIsHost && !room.peers.has(peerId)) {
    return { peers: [], isLocked: true, error: "Meeting is locked by the host. New participants cannot join." };
  }

  const now = Date.now();
  const isNew = !room.peers.has(peerId);

  if (actualIsHost) {
    room.hostPeerId = peerId;
  }

  room.peers.set(peerId, {
    peerId,
    displayName,
    micEnabled,
    camEnabled,
    isScreenSharing: !!isScreenSharing,
    isHost: actualIsHost,
    joinedAt: now,
  });

  room.signals = room.signals.filter((s) => now - s.timestamp < 120000);

  if (isNew) {
    const notice: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: peerId,
      toPeerId: "ALL",
      type: "user-joined",
      payload: { peerId, displayName, micEnabled, camEnabled, isScreenSharing, isHost: actualIsHost },
      timestamp: now,
    };
    room.signals.push(notice);
  }

  return { peers: Array.from(room.peers.values()), isLocked: room.isLocked, isEnded: room.isEnded };
}

/**
 * Updates camera, mic, and screen sharing states for a peer and broadcasts change
 */
export function updatePeerState(
  roomId: string,
  peerId: string,
  micEnabled: boolean,
  camEnabled: boolean,
  isScreenSharing?: boolean,
  isHost?: boolean
) {
  const room = getOrCreateRoom(roomId);
  const peer = room.peers.get(peerId);
  if (peer) {
    peer.micEnabled = micEnabled;
    peer.camEnabled = camEnabled;
    peer.isScreenSharing = !!isScreenSharing;
    if (isHost !== undefined) peer.isHost = !!isHost;

    const now = Date.now();
    const notice: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: peerId,
      toPeerId: "ALL",
      type: "state-change",
      payload: { peerId, micEnabled, camEnabled, isScreenSharing: !!isScreenSharing, isHost: peer.isHost },
      timestamp: now,
    };
    room.signals.push(notice);
  }
}

/**
 * Host Control Action: Mute a participant's microphone on the server
 */
export function hostMutePeer(
  roomId: string,
  requesterPeerId: string,
  targetPeerId: string
): { success: boolean; error?: string } {
  if (!verifyHostPermission(roomId, requesterPeerId)) {
    return { success: false, error: "Unauthorized: Only the meeting host can mute participants." };
  }

  const room = getOrCreateRoom(roomId);
  const targetPeer = room.peers.get(targetPeerId);
  if (targetPeer) {
    targetPeer.micEnabled = false;

    const now = Date.now();
    // Broadcast force-mute signal to target peer
    const sig: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: requesterPeerId,
      toPeerId: targetPeerId,
      type: "force-mute",
      payload: { targetPeerId },
      timestamp: now,
    };
    room.signals.push(sig);

    // Broadcast room state change
    const stateSig: SignalMessage = {
      id: `sig-${now + 1}-${Math.random()}`,
      fromPeerId: targetPeerId,
      toPeerId: "ALL",
      type: "state-change",
      payload: { peerId: targetPeerId, micEnabled: false, camEnabled: targetPeer.camEnabled, isScreenSharing: targetPeer.isScreenSharing, isHost: targetPeer.isHost },
      timestamp: now,
    };
    room.signals.push(stateSig);
  }

  return { success: true };
}

/**
 * Host Control Action: Stop a participant's screen sharing presentation on the server
 */
export function hostStopScreenSharePeer(
  roomId: string,
  requesterPeerId: string,
  targetPeerId: string
): { success: boolean; error?: string } {
  if (!verifyHostPermission(roomId, requesterPeerId)) {
    return { success: false, error: "Unauthorized: Only the meeting host can stop participant screen sharing." };
  }

  const room = getOrCreateRoom(roomId);
  const targetPeer = room.peers.get(targetPeerId);
  if (targetPeer) {
    targetPeer.isScreenSharing = false;

    const now = Date.now();
    const sig: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: requesterPeerId,
      toPeerId: targetPeerId,
      type: "force-stop-share",
      payload: { targetPeerId },
      timestamp: now,
    };
    room.signals.push(sig);

    const stateSig: SignalMessage = {
      id: `sig-${now + 1}-${Math.random()}`,
      fromPeerId: targetPeerId,
      toPeerId: "ALL",
      type: "state-change",
      payload: { peerId: targetPeerId, micEnabled: targetPeer.micEnabled, camEnabled: targetPeer.camEnabled, isScreenSharing: false, isHost: targetPeer.isHost },
      timestamp: now,
    };
    room.signals.push(stateSig);
  }

  return { success: true };
}

/**
 * Host Control Action: Remove / kick a participant from the meeting on the server
 */
export function hostRemovePeer(
  roomId: string,
  requesterPeerId: string,
  targetPeerId: string
): { success: boolean; error?: string } {
  if (!verifyHostPermission(roomId, requesterPeerId)) {
    return { success: false, error: "Unauthorized: Only the meeting host can remove participants." };
  }

  const room = getOrCreateRoom(roomId);
  if (room.peers.has(targetPeerId)) {
    const now = Date.now();
    // Broadcast force-remove signal to target peer
    const sig: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: requesterPeerId,
      toPeerId: targetPeerId,
      type: "force-remove",
      payload: { targetPeerId },
      timestamp: now,
    };
    room.signals.push(sig);

    unregisterPeer(roomId, targetPeerId);
  }

  return { success: true };
}

/**
 * Host Control Action: Toggle meeting lock state on the server
 */
export function hostToggleLock(
  roomId: string,
  requesterPeerId: string,
  isLocked: boolean
): { success: boolean; isLocked?: boolean; error?: string } {
  if (!verifyHostPermission(roomId, requesterPeerId)) {
    return { success: false, error: "Unauthorized: Only the meeting host can lock or unlock the meeting." };
  }

  const room = getOrCreateRoom(roomId);
  room.isLocked = isLocked;
  setMeetingLocked(roomId, isLocked);

  const now = Date.now();
  const sig: SignalMessage = {
    id: `sig-${now}-${Math.random()}`,
    fromPeerId: requesterPeerId,
    toPeerId: "ALL",
    type: "room-lock-changed",
    payload: { isLocked },
    timestamp: now,
  };
  room.signals.push(sig);

  return { success: true, isLocked };
}

/**
 * Host Control Action: End meeting for all participants on the server
 */
export function hostEndMeeting(
  roomId: string,
  requesterPeerId: string
): { success: boolean; error?: string } {
  if (!verifyHostPermission(roomId, requesterPeerId)) {
    return { success: false, error: "Unauthorized: Only the meeting host can end the meeting." };
  }

  const room = getOrCreateRoom(roomId);
  room.isEnded = true;
  setMeetingStatus(roomId, "ended");

  const now = Date.now();
  const sig: SignalMessage = {
    id: `sig-${now}-${Math.random()}`,
    fromPeerId: requesterPeerId,
    toPeerId: "ALL",
    type: "meeting-ended",
    payload: { endedBy: requesterPeerId },
    timestamp: now,
  };
  room.signals.push(sig);

  // Clear room peers
  room.peers.clear();

  return { success: true };
}

/**
 * Removes a peer from a room when leaving
 */
export function unregisterPeer(roomId: string, peerId: string) {
  const normalizedId = roomId.toUpperCase().trim();
  const room = rooms.get(normalizedId);
  if (room) {
    room.peers.delete(peerId);

    const now = Date.now();
    const notice: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: peerId,
      toPeerId: "ALL",
      type: "user-left",
      payload: { peerId },
      timestamp: now,
    };
    room.signals.push(notice);

    if (room.peers.size === 0 && !room.isEnded) {
      rooms.delete(normalizedId);
    }
  }
}

/**
 * Queues an SDP offer/answer or ICE candidate signal
 */
export function postSignalMessage(
  roomId: string,
  fromPeerId: string,
  toPeerId: string,
  type: SignalMessage["type"],
  payload?: any
) {
  const room = getOrCreateRoom(roomId);
  const now = Date.now();

  const msg: SignalMessage = {
    id: `sig-${now}-${Math.random()}`,
    fromPeerId,
    toPeerId,
    type,
    payload,
    timestamp: now,
  };

  room.signals.push(msg);
}

/**
 * Retrieves pending signaling messages intended for a specific peer ID since last timestamp
 */
export function getRoomSignalsForPeer(
  roomId: string,
  peerId: string,
  sinceTimestamp: number
): { peers: PeerInfo[]; signals: SignalMessage[]; isLocked?: boolean; isEnded?: boolean } {
  const normalizedId = roomId.toUpperCase().trim();
  const room = rooms.get(normalizedId);
  if (!room) {
    return { peers: [], signals: [], isLocked: false, isEnded: false };
  }

  const peers = Array.from(room.peers.values());
  const pending = room.signals.filter(
    (s) =>
      s.timestamp > sinceTimestamp &&
      s.fromPeerId !== peerId &&
      (s.toPeerId === peerId || s.toPeerId === "ALL")
  );

  return { peers, signals: pending, isLocked: room.isLocked, isEnded: room.isEnded };
}
