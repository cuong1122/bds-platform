const SESSION_COOKIE = "bds_session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 năm

export function getSessionId(): string {
  if (typeof document === "undefined") return "";

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`)
  );
  if (match) return decodeURIComponent(match[1]);

  const id = crypto.randomUUID();
  document.cookie = `${SESSION_COOKIE}=${id}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
  return id;
}
