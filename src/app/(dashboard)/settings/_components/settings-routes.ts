export const SETTINGS_ROUTES = {
  profile: "/settings/profile",
  sessions: "/settings/network/sessions",
  security: "/settings/security",
  tax: "/settings/business/tax",
  destinations: "/settings/business/preference/destinations",
} as const;

export type SettingsTab = "profile" | "sessions" | "security" | "tax" | "destinations";

export function getTabFromPath(
  pathname: string,
  urlTab?: string | null
): SettingsTab {
  if (urlTab) {
    const t = urlTab.toLowerCase();
    if (t === "profile") return "profile";
    if (t === "sessions") return "sessions";
    if (t === "security") return "security";
    if (t === "tax") return "tax";
    if (t === "destinations") return "destinations";
  }

  const p = decodeURIComponent(pathname || "").toLowerCase();
  if (p.includes("destination")) return "destinations";
  if (p.includes("tax")) return "tax";
  if (p.includes("session")) return "sessions";
  if (p.includes("network")) return "sessions";
  if (p.includes("security") || p.includes("password")) return "security";
  if (p.includes("profile")) return "profile";
  return "destinations";
}

