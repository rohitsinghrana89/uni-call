export interface Meeting {
  id: string;
  url: string;
  title: string;
  host: string;
  createdAt: string;
  status: "scheduled" | "active" | "ended";
  participantsCount: number;
  isEncrypted: boolean;
  isLocked?: boolean;
}

// In-memory server store for meetings metadata
const meetingsStore: Map<string, Meeting> = new Map([
  [
    "ABC123",
    {
      id: "ABC123",
      url: "/meeting/ABC123",
      title: "Q3 Strategy & Product Sync",
      host: "Alex Morgan",
      createdAt: new Date().toISOString(),
      status: "active",
      participantsCount: 4,
      isEncrypted: true,
      isLocked: false,
    },
  ],
  [
    "XYZ789",
    {
      id: "XYZ789",
      url: "/meeting/XYZ789",
      title: "Engineering Architecture Review",
      host: "Sarah Jenkins",
      createdAt: new Date().toISOString(),
      status: "scheduled",
      participantsCount: 6,
      isEncrypted: true,
      isLocked: false,
    },
  ],
]);

/**
 * Generates a unique, clean 6-character alphanumeric meeting ID (e.g. ABC123, K9P2M4)
 */
export function generateUniqueMeetingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  do {
    result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (meetingsStore.has(result));

  return result;
}

/**
 * Creates and saves a new meeting record in the store
 */
export function createMeeting(title?: string, host?: string, customId?: string): Meeting {
  const id = customId ? customId.toUpperCase() : generateUniqueMeetingId();
  const meetingTitle = title?.trim() || `Instant Meeting (${id})`;
  const hostName = host?.trim() || "Alex Morgan";

  const newMeeting: Meeting = {
    id,
    url: `/meeting/${id}`,
    title: meetingTitle,
    host: hostName,
    createdAt: new Date().toISOString(),
    status: "active",
    participantsCount: 1,
    isEncrypted: true,
    isLocked: false,
  };

  meetingsStore.set(id, newMeeting);
  return newMeeting;
}

/**
 * Retrieves meeting details by ID
 */
export function getMeetingById(id: string): Meeting | undefined {
  const normalizedId = id.toUpperCase().trim();
  return meetingsStore.get(normalizedId);
}

/**
 * Updates lock state of a meeting
 */
export function setMeetingLocked(id: string, isLocked: boolean): boolean {
  const meeting = getMeetingById(id);
  if (meeting) {
    meeting.isLocked = isLocked;
    return true;
  }
  return false;
}

/**
 * Updates meeting status (e.g. "ended")
 */
export function setMeetingStatus(id: string, status: Meeting["status"]): boolean {
  const meeting = getMeetingById(id);
  if (meeting) {
    meeting.status = status;
    return true;
  }
  return false;
}

/**
 * Lists all meetings stored in memory
 */
export function listMeetings(): Meeting[] {
  return Array.from(meetingsStore.values());
}
