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
  type: "offer" | "answer" | "ice-candidate" | "state-change" | "user-joined" | "user-left";
  payload?: any;
  timestamp: number;
}

interface RoomState {
  peers: Map<string, PeerInfo>;
  signals: SignalMessage[];
}

// Global in-memory WebRTC signaling store mapped by meeting ID
const rooms: Map<string, RoomState> = new Map();

function getOrCreateRoom(roomId: string): RoomState {
  const normalizedId = roomId.toUpperCase().trim();
  if (!rooms.has(normalizedId)) {
    rooms.set(normalizedId, {
      peers: new Map(),
      signals: [],
    });
  }
  return rooms.get(normalizedId)!;
}

/**
 * Registers or updates a peer in a meeting room
 */
export function registerPeer(
  roomId: string,
  peerId: string,
  displayName: string,
  micEnabled: boolean,
  camEnabled: boolean,
  isScreenSharing?: boolean,
  isHost?: boolean
): PeerInfo[] {
  const room = getOrCreateRoom(roomId);
  const now = Date.now();

  const isNew = !room.peers.has(peerId);

  room.peers.set(peerId, {
    peerId,
    displayName,
    micEnabled,
    camEnabled,
    isScreenSharing: !!isScreenSharing,
    isHost: !!isHost,
    joinedAt: now,
  });

  room.signals = room.signals.filter((s) => now - s.timestamp < 120000);

  if (isNew) {
    const notice: SignalMessage = {
      id: `sig-${now}-${Math.random()}`,
      fromPeerId: peerId,
      toPeerId: "ALL",
      type: "user-joined",
      payload: { peerId, displayName, micEnabled, camEnabled, isScreenSharing, isHost: !!isHost },
      timestamp: now,
    };
    room.signals.push(notice);
  }

  return Array.from(room.peers.values());
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

    if (room.peers.size === 0) {
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
): { peers: PeerInfo[]; signals: SignalMessage[] } {
  const normalizedId = roomId.toUpperCase().trim();
  const room = rooms.get(normalizedId);
  if (!room) {
    return { peers: [], signals: [] };
  }

  const peers = Array.from(room.peers.values());
  const pending = room.signals.filter(
    (s) =>
      s.timestamp > sinceTimestamp &&
      s.fromPeerId !== peerId &&
      (s.toPeerId === peerId || s.toPeerId === "ALL")
  );

  return { peers, signals: pending };
}
