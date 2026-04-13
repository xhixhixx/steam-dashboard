import Image from "next/image";
import {
  getPersonaStatus,
  type SteamUserSummary,
} from "@/features/steam-dashboard/api/steam";
import { SteamSearchForm } from "@/features/steam-dashboard/components/steam-search-form";

type TopbarProps = {
  initialValue: string;
  summary?: SteamUserSummary | null;
};

export function Topbar({ initialValue, summary }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#1f2937]/70 bg-[#0b1220]/75 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1280px] items-center gap-4 px-4 lg:px-6">
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-[#66c0f4] lg:hidden">
            STEAMLAB
          </p>
          <h1 className="text-[22px] font-semibold tracking-tight text-white">
            Dashboard
          </h1>
        </div>

        <div className="flex-1" />

        <div className="hidden md:block">
          <SteamSearchForm initialValue={initialValue} compact />
        </div>

        <button className="relative rounded-xl border border-[#1f2937] bg-[#121a2b]/70 p-2.5 text-slate-400 transition hover:bg-[#121a2b] hover:text-white">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#66c0f4]" />
        </button>

        <div className="hidden h-7 w-px bg-[#1f2937] sm:block" />

        <div className="flex items-center gap-2.5">
          {summary ? (
            <>
              <div className="relative">
                <Image
                  src={summary.player.avatarfull}
                  alt={`${summary.player.personaname} avatar`}
                  width={32}
                  height={32}
                  className="rounded-full ring-1 ring-[#1f2937]"
                />
                <span className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b1220]" />
              </div>
              <div className="hidden sm:block">
                <span className="text-[14px] font-medium text-white">
                  {summary.player.personaname}
                </span>
                <p className="text-[11px] text-slate-500">
                  {getPersonaStatus(summary.player.personastate)}
                </p>
              </div>
            </>
          ) : (
            <span className="hidden text-sm text-slate-400 sm:block">
              Search a profile
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-[#1f2937]/60 px-4 py-3 md:hidden">
        <SteamSearchForm initialValue={initialValue} compact />
      </div>
    </header>
  );
}
