import Image from "next/image";
import {
  getPersonaStatus,
  type SteamUserSummary,
} from "@/features/steam-dashboard/api/steam";

type SidebarProps = {
  summary?: SteamUserSummary | null;
};

export function Sidebar({ summary }: SidebarProps) {
  return (
    <aside className="hidden border-r border-[#1f2937] bg-[#0b1220]/90 lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-[240px]">
      <div className="flex h-full flex-col">
        <div className="flex h-[68px] items-center border-b border-[#1f2937]/60 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#66c0f4] to-[#3b82f6] shadow-[0_0_20px_rgba(102,192,244,0.25)]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-black"
              >
                <path
                  d="M12 2a10 10 0 1 0 5.3 18.6l-2.1-2.1A7 7 0 1 1 19 12h2A10 10 0 0 0 12 2Zm-1.1 6.3 2.3 2.3-1.4 1.4-2.3-2.3A3.5 3.5 0 1 0 10.9 8.3Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-[0.18em] text-white">
              STEAMLAB
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          {[
            { label: "Dashboard", active: true },
            { label: "Library" },
            { label: "Activity" },
            { label: "Insights" },
            { label: "Backlog" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                item.active
                  ? "border border-[#66c0f4]/20 bg-[#66c0f4]/10 font-medium text-[#66c0f4]"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current/80" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#1f2937]/70 p-3">
          <div className="flex items-center gap-3 rounded-xl border border-[#1f2937] bg-[#121a2b]/60 p-2.5">
            {summary ? (
              <Image
                src={summary.player.avatarfull}
                alt={`${summary.player.personaname} avatar`}
                width={36}
                height={36}
                className="rounded-full ring-1 ring-[#1f2937]"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#1a2440]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                {summary?.player.personaname ?? "No profile loaded"}
              </p>
              <p className="text-[11px] text-slate-500">
                {summary
                  ? getPersonaStatus(summary.player.personastate)
                  : "Search to begin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
