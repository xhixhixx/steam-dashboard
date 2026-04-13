import Image from "next/image";
import { SteamSearchForm } from "@/components/steam-search-form";
import {
  formatPlaytime,
  formatUnixDate,
  getSteamErrorDetails,
  getSteamUserSummaryByIdentifier,
} from "@/lib/steam";

type HomePageProps = {
  searchParams: Promise<{
    user?: string | string[];
  }>;
};

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

function Navbar({ initialValue }: { initialValue: string }) {
  return (
    <header className="border-b border-white/10 bg-slate-950/45 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6 md:px-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
            Steam Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Search any Steam profile by ID64 or vanity name
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-300">
            This page runs on the server, resolves the user identifier through
            Steam&apos;s Web API, and keeps the result shareable through the URL.
          </p>
        </div>
        <SteamSearchForm initialValue={initialValue} />
      </div>
    </header>
  );
}

function EmptyState() {
  return (
    <section className="rounded-[2rem] border border-cyan-300/20 bg-white/8 p-8 shadow-2xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
        Ready to search
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
        Start with a Steam ID64 or custom profile name
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
        Try a numeric Steam ID like <code>76561197960435530</code> or a vanity
        name from a profile URL such as{" "}
        <code>steamcommunity.com/id/gaben</code>.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-slate-950/55 p-5">
          <p className="text-sm font-semibold text-white">What works</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Steam ID64 values and custom profile names supported by Steam&apos;s
            official <code>ResolveVanityURL</code> endpoint.
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-slate-950/55 p-5">
          <p className="text-sm font-semibold text-white">What does not</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Random display-name search. Steam does not offer an official Web API
            endpoint for that kind of lookup.
          </p>
        </div>
      </div>
    </section>
  );
}

function ErrorState({
  message,
  requestedUser,
}: {
  message: string;
  requestedUser: string;
}) {
  return (
    <section className="rounded-3xl border border-rose-300/30 bg-rose-50/95 p-8 text-rose-950 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.3em]">
        Steam request failed
      </p>
      <h2 className="mt-4 text-3xl font-semibold">
        We couldn&apos;t find that Steam profile
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-rose-900/80">
        {message}
      </p>
      <p className="mt-4 text-sm leading-7 text-rose-900/80">
        Search attempted for <code>{requestedUser}</code>. Double-check the
        Steam ID64, or if you entered a name, make sure it is the custom profile
        name from <code>steamcommunity.com/id/&lt;name&gt;</code>.
      </p>
    </section>
  );
}

function ProfileSection({
  summary,
}: {
  summary: Awaited<ReturnType<typeof getSteamUserSummaryByIdentifier>>;
}) {
  const topGames = summary.ownedGames.slice(0, 5);

  return (
    <>
      <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/30 backdrop-blur md:grid-cols-[auto_1fr] md:items-center">
        <Image
          src={summary.player.avatarfull}
          alt={`${summary.player.personaname} avatar`}
          width={112}
          height={112}
          className="h-28 w-28 rounded-3xl border border-white/10 object-cover"
        />
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
            Steam profile
          </p>
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">
              {summary.player.personaname}
            </h2>
            <p className="mt-2 text-base text-slate-300">
              Steam ID:{" "}
              <span className="font-mono text-sm">{summary.player.steamid}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
              Country: {summary.player.loccountrycode ?? "Unknown"}
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
              Joined Steam: {formatUnixDate(summary.player.timecreated)}
            </span>
            <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
              Games found: {summary.ownedGames.length}
            </span>
          </div>
          <a
            href={summary.player.profileurl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Open Steam profile
          </a>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
            Top owned games
          </p>
          {topGames.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {topGames.map((game) => (
                <li
                  key={game.appid}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-4"
                >
                  <div>
                    <p className="text-lg font-medium text-white">{game.name}</p>
                    <p className="text-sm text-slate-400">App ID: {game.appid}</p>
                  </div>
                  <p className="text-sm font-semibold text-cyan-200">
                    {formatPlaytime(game.playtime_forever)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-sm leading-7 text-slate-300">
              This profile did not return any public owned-game data. The
              profile may be private, or the game library may not be visible.
            </p>
          )}
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
            How this page works
          </p>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
            <li>
              <span className="font-semibold text-white">1.</span> The navbar
              updates the URL to <code className="mx-1">/?user=...</code>.
            </li>
            <li>
              <span className="font-semibold text-white">2.</span> This
              <code className="mx-1">page.tsx</code> file reads that query value on
              the server.
            </li>
            <li>
              <span className="font-semibold text-white">3.</span> The Steam helper
              accepts either a Steam ID64 or vanity name and resolves it before
              loading profile data.
            </li>
            <li>
              <span className="font-semibold text-white">4.</span> The Steam API key
              still stays in <code className="mx-1">.env.local</code>, so it never
              reaches the browser.
            </li>
          </ol>
        </article>
      </section>
    </>
  );
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const { requestedUser, summary, error } = await loadSteamData(
    resolvedSearchParams.user,
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1b2838,_#0f1724_42%,_#07111d_100%)] text-slate-100">
      <Navbar initialValue={requestedUser} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 md:px-10 md:py-16">
        {!requestedUser ? <EmptyState /> : null}
        {requestedUser && error ? (
          <ErrorState message={error.message} requestedUser={requestedUser} />
        ) : null}
        {summary ? <ProfileSection summary={summary} /> : null}
      </div>
    </main>
  );
}
