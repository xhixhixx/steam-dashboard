import Image from "next/image";
import { SteamSearchForm } from "@/components/steam-search-form";
import {
  formatPlaytime,
  getSteamErrorDetails,
  getSteamUserSummaryByIdentifier,
} from "@/lib/steam";

type HomePageProps = {
  searchParams: Promise<{
    user?: string | string[];
  }>;
};

type GenreSlice = {
  label: string;
  value: number;
  color: string;
};

const sidebarItems = [
  "Dashboard",
  "Library",
  "Achievements",
  "Insights",
  "Settings",
];

const genreSlices: GenreSlice[] = [
  { label: "RPG", value: 32, color: "#6bc7ff" },
  { label: "Action", value: 24, color: "#4d90ff" },
  { label: "Adventure", value: 18, color: "#2fb9ff" },
  { label: "Strategy", value: 14, color: "#1ca0f0" },
  { label: "Indie", value: 12, color: "#1487d4" },
];

async function loadSteamData(identifier?: string | string[]) {
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

function buildDonutGradient(slices: GenreSlice[]) {
  let offset = 0;

  const parts = slices.map((slice) => {
    const start = offset;
    const end = offset + slice.value;
    offset = end;
    return `${slice.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${parts.join(", ")})`;
}

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-white/10 bg-[#040f23]">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#3fa9ff] text-lg font-bold text-[#041127]">
          ⟳
        </div>
        <p className="text-2xl font-semibold tracking-widest text-slate-100">STEAMLAB</p>
      </div>

      <nav className="space-y-2 px-3 py-4">
        {sidebarItems.map((item, index) => {
          const active = index === 0;
          return (
            <div
              key={item}
              className={`rounded-2xl px-4 py-3 text-lg ${
                active
                  ? "border border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                  : "text-slate-400"
              }`}
            >
              {item}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-[#09152d] p-3 text-sm text-slate-300">
          <p className="font-semibold text-slate-200">DoAnhQuang</p>
          <p className="text-xs text-slate-500">Level 42 • Online</p>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ requestedUser }: { requestedUser: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-8">
      <h1 className="text-4xl font-semibold text-slate-100">Dashboard</h1>
      <div className="flex items-center gap-5">
        <SteamSearchForm initialValue={requestedUser} />
        <div className="text-2xl text-slate-400">🔔</div>
        <div className="h-8 w-px bg-white/15" />
        <div className="flex items-center gap-3 text-lg text-slate-200">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-cyan-400/30 bg-cyan-500/10" />
          <span>DoAnhQuang</span>
        </div>
      </div>
    </header>
  );
}

function StatCard({
  icon,
  title,
  value,
  delta,
  detail,
}: {
  icon: string;
  title: string;
  value: string;
  delta: string;
  detail: string;
}) {
  const positive = !delta.startsWith("-");

  return (
    <article className="rounded-3xl border border-[#20385a] bg-[#0b1933]/90 p-5 shadow-[0_20px_60px_-30px_rgba(20,140,220,0.4)]">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-xl text-cyan-200">
          {icon}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            positive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-rose-500/15 text-rose-300"
          }`}
        >
          {delta}
        </span>
      </div>
      <p className="mt-5 text-lg text-slate-400">{title}</p>
      <p className="mt-1 text-6xl font-semibold text-slate-100">{value}</p>
      <p className="mt-2 text-lg text-slate-500">{detail}</p>
    </article>
  );
}

function DashboardContent({
  summary,
}: {
  summary: Awaited<ReturnType<typeof getSteamUserSummaryByIdentifier>>;
}) {
  const topGames = summary.ownedGames
    .slice()
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 5);
  const totalHours = Math.round(
    summary.ownedGames.reduce((sum, game) => sum + game.playtime_forever, 0) / 60,
  );
  const playedGamesCount = summary.ownedGames.filter(
    (game) => game.playtime_forever > 0,
  ).length;
  const completion = summary.ownedGames.length
    ? Math.round((playedGamesCount / summary.ownedGames.length) * 100)
    : 0;
  const averageHoursPerGame = summary.ownedGames.length
    ? (totalHours / summary.ownedGames.length).toFixed(2)
    : "0.00";
  const recentGames = topGames.concat(summary.ownedGames.slice(5, 8)).slice(0, 8);

  return (
    <div className="space-y-6 px-8 py-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard
          icon="🗂"
          title="Total Games"
          value={summary.ownedGames.length.toString()}
          delta={`+${Math.min(12, summary.ownedGames.length)}`}
          detail="in library"
        />
        <StatCard
          icon="◔"
          title="Hours Played"
          value={totalHours.toLocaleString()}
          delta={`+${Math.min(47, totalHours)}`}
          detail="total lifetime"
        />
        <StatCard
          icon="$"
          title="Avg Hrs / Game"
          value={averageHoursPerGame}
          delta="-0.08"
          detail="efficiency improving"
        />
        <StatCard
          icon="☑"
          title="Completion"
          value={`${completion}%`}
          delta={`+${Math.min(3, completion)}%`}
          detail={`${playedGamesCount} of ${summary.ownedGames.length} played`}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="rounded-3xl border border-[#20385a] bg-[#0b1933]/90 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-semibold text-slate-100">Top 5 by Hours</p>
              <p className="text-lg text-slate-500">Lifetime playtime</p>
            </div>
            <span className="text-slate-500">•••</span>
          </div>
          <ul className="mt-6 space-y-4">
            {topGames.map((game) => {
              const percent = topGames[0]
                ? (game.playtime_forever / topGames[0].playtime_forever) * 100
                : 0;
              return (
                <li key={game.appid} className="grid grid-cols-[160px_1fr] items-center gap-4">
                  <span className="truncate text-lg text-slate-400">{game.name}</span>
                  <div className="h-10 rounded-xl bg-[#0e2544] p-0.5">
                    <div
                      className="h-full rounded-[10px] bg-gradient-to-r from-[#69c2ff] to-[#3f83ff]"
                      style={{ width: `${Math.max(percent, 6)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#20385a] bg-[#0b1933]/90 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-semibold text-slate-100">Genre DNA</p>
              <p className="text-lg text-slate-500">Your library breakdown</p>
            </div>
            <span className="rounded-full border border-cyan-300/20 px-3 py-1 text-sm text-slate-400">
              {summary.ownedGames.length} games
            </span>
          </div>

          <div className="mt-6 grid items-center gap-6 lg:grid-cols-[260px_1fr]">
            <div className="relative mx-auto h-56 w-56 rounded-full" style={{ background: buildDonutGradient(genreSlices) }}>
              <div className="absolute inset-[34px] rounded-full bg-[#0b1933]" />
            </div>
            <ul className="space-y-3">
              {genreSlices.map((slice) => (
                <li key={slice.label} className="flex items-center justify-between text-lg text-slate-300">
                  <span className="flex items-center gap-3">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.label}
                  </span>
                  <span>{slice.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <article className="rounded-3xl border border-[#20385a] bg-[#0b1933]/90 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl font-semibold text-slate-100">Recent Activity</p>
            <p className="text-lg text-slate-500">Last 14 days</p>
          </div>
          <a className="text-lg text-cyan-300" href={summary.player.profileurl} target="_blank" rel="noreferrer">
            View all
          </a>
        </div>

        <ul className="mt-6 grid gap-3 lg:grid-cols-4">
          {recentGames.map((game, index) => (
            <li
              key={`${game.appid}-${index}`}
              className="rounded-2xl border border-white/10 bg-[#0a1730] p-3"
            >
              <p className="truncate text-lg font-medium text-slate-200">{game.name}</p>
              <p className="mt-1 text-sm text-slate-400">{formatPlaytime(game.playtime_forever)}</p>
              <p className="mt-1 text-sm text-cyan-300">+{24 + index * 13}h</p>
            </li>
          ))}
        </ul>
      </article>

      <section className="flex items-center gap-4 rounded-3xl border border-[#20385a] bg-[#0b1933]/90 p-5">
        <Image
          src={summary.player.avatarfull}
          alt={`${summary.player.personaname} avatar`}
          width={48}
          height={48}
          className="rounded-xl border border-white/10"
        />
        <div>
          <p className="text-lg text-slate-100">Signed in as {summary.player.personaname}</p>
          <p className="text-sm text-slate-400">Steam ID: {summary.player.steamid}</p>
        </div>
      </section>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="grid h-[calc(100vh-64px)] place-items-center px-8">
      <div className="max-w-xl rounded-3xl border border-cyan-300/20 bg-[#0b1933]/90 p-8 text-center">
        <p className="text-5xl">🎮</p>
        <h2 className="mt-4 text-4xl font-semibold text-slate-100">
          Search a Steam ID to load this dashboard
        </h2>
        <p className="mt-3 text-lg text-slate-400">
          Use the search box in the top-right with a Steam ID64 or vanity URL name.
        </p>
      </div>
    </div>
  );
}

function ErrorDashboard({
  requestedUser,
  message,
}: {
  requestedUser: string;
  message: string;
}) {
  return (
    <div className="grid h-[calc(100vh-64px)] place-items-center px-8">
      <div className="max-w-xl rounded-3xl border border-rose-300/30 bg-rose-500/10 p-8 text-center">
        <h2 className="text-4xl font-semibold text-rose-200">Profile lookup failed</h2>
        <p className="mt-3 text-lg text-rose-100/90">{message}</p>
        <p className="mt-3 text-sm text-rose-100/70">Searched for: {requestedUser}</p>
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const { requestedUser, summary, error } = await loadSteamData(
    resolvedSearchParams.user,
  );

  return (
    <main className="flex min-h-screen bg-[radial-gradient(circle_at_30%_0%,_#0d2345_0%,_#04142e_45%,_#020c1c_100%)] text-slate-100">
      <Sidebar />
      <div className="flex-1">
        <Topbar requestedUser={requestedUser} />
        {!requestedUser ? <EmptyDashboard /> : null}
        {requestedUser && error ? (
          <ErrorDashboard requestedUser={requestedUser} message={error.message} />
        ) : null}
        {summary ? <DashboardContent summary={summary} /> : null}
      </div>
    </main>
  );
}
