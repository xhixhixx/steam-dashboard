import {
  getSteamErrorDetails,
  getSteamUserSummaryByIdentifier,
} from "@/features/steam-dashboard/api/steam";

export async function loadSteamDashboard(identifier?: string | string[]) {
  const user =
    typeof identifier === "string"
      ? identifier
      : Array.isArray(identifier)
        ? identifier[0]
        : "";

  const trimmedUser = user.trim();

  if (!trimmedUser) {
    return {
      requestedUser: "",
      summary: null,
      error: null,
    };
  }

  try {
    return {
      requestedUser: trimmedUser,
      summary: await getSteamUserSummaryByIdentifier(trimmedUser),
      error: null,
    };
  } catch (error) {
    return {
      requestedUser: trimmedUser,
      summary: null,
      error: getSteamErrorDetails(error),
    };
  }
}
