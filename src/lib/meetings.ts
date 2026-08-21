import connectDB from "./db";
import MeetingModel from "@/models/Meeting";

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

// In-memory cache for fast lookup
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
 * Creates and saves a new meeting record in MongoDB and memory store
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

  // Asynchronously persist to MongoDB Atlas
  connectDB()
    .then(() => {
      MeetingModel.create({
        meetingCode: id,
        title: meetingTitle,
        host_Id: hostName,
        isLocked: false,
        created_At: new Date(),
      }).catch(() => {
        MeetingModel.updateOne({ meetingCode: id }, { title: meetingTitle, host_Id: hostName }).catch(() => {});
      });
    })
    .catch((err) => console.error("MongoDB meeting creation error:", err));

  return newMeeting;
}

/**
 * Retrieves meeting details by ID
 */
export function getMeetingById(id: string): Meeting | undefined {
  const normalizedId = id.toUpperCase().trim();
  const cached = meetingsStore.get(normalizedId);
  if (cached) return cached;

  connectDB()
    .then(async () => {
      const doc = await MeetingModel.findOne({ meetingCode: normalizedId });
      if (doc) {
        meetingsStore.set(normalizedId, {
          id: doc.meetingCode,
          url: `/meeting/${doc.meetingCode}`,
          title: doc.title,
          host: doc.host_Id,
          createdAt: doc.created_At ? doc.created_At.toISOString() : new Date().toISOString(),
          status: doc.ended_At ? "ended" : "active",
          participantsCount: 1,
          isEncrypted: true,
          isLocked: !!doc.isLocked,
        });
      }
    })
    .catch(() => {});

  return undefined;
}

/**
 * Updates lock state of a meeting in memory and MongoDB Atlas
 */
export function setMeetingLocked(id: string, isLocked: boolean): boolean {
  const meeting = meetingsStore.get(id.toUpperCase().trim());
  if (meeting) {
    meeting.isLocked = isLocked;
  }

  connectDB()
    .then(() => {
      MeetingModel.updateOne({ meetingCode: id.toUpperCase().trim() }, { isLocked }).catch(() => {});
    })
    .catch(() => {});

  return true;
}

/**
 * Updates meeting status (e.g. "ended") in memory and MongoDB Atlas
 */
export function setMeetingStatus(id: string, status: Meeting["status"]): boolean {
  const meeting = meetingsStore.get(id.toUpperCase().trim());
  if (meeting) {
    meeting.status = status;
  }

  connectDB()
    .then(() => {
      const updateObj = status === "ended" ? { ended_At: new Date() } : {};
      MeetingModel.updateOne({ meetingCode: id.toUpperCase().trim() }, updateObj).catch(() => {});
    })
    .catch(() => {});

  return true;
}

/**
 * Lists all meetings stored
 */
export function listMeetings(): Meeting[] {
  return Array.from(meetingsStore.values());
}
