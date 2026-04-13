"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SteamSearchFormProps = {
  initialValue: string;
};

export function SteamSearchForm({ initialValue }: SteamSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setError("Enter a Steam ID64 or a custom profile name.");
      return;
    }

    setError("");

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set("user", trimmedValue);

    router.push(`${pathname}?${nextSearchParams.toString()}`);
  }

  return (
    <form className="w-full max-w-2xl" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="sr-only" htmlFor="steam-user-search">
          Search by Steam ID64 or custom profile name
        </label>
        <input
          id="steam-user-search"
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="Enter a Steam ID64 or custom profile name"
          className="min-w-0 flex-1 rounded-full border border-white/12 bg-slate-950/70 px-5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
        />
        <button
          type="submit"
          className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Search
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-rose-200" aria-live="polite">
        {error || "Use a Steam ID64 or a custom profile name like gaben."}
      </p>
    </form>
  );
}
