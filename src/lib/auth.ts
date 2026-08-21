export interface UserSession {
  id: string;
  name: string;
  email: string;
  created_At?: string;
}

const STORAGE_KEY = "unicall_user";

export function getStoredUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.name && parsed.email) {
      return parsed as UserSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to save user session", err);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear user session", err);
  }
}

export function getUserInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
