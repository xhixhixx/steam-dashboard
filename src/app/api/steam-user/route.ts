import type { NextRequest } from "next/server";
import {
  getSteamErrorDetails,
  getSteamUserSummaryByIdentifier,
  normalizeSteamIdentifier,
} from "@/lib/steam";

export async function GET(request: NextRequest) {
  try {
    const user = normalizeSteamIdentifier(
      request.nextUrl.searchParams.get("user") ?? "",
    );
    const summary = await getSteamUserSummaryByIdentifier(user);
    return Response.json(summary);
  } catch (error) {
    const { message, statusCode } = getSteamErrorDetails(error);

    return Response.json({ error: message }, { status: statusCode });
  }
}
