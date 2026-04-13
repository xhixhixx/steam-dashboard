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
    <form className="w-full max-w-md" onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="steam-user-search">
        Search by Steam ID64 or custom profile name
      </label>
      <div className="relative">
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
          placeholder="Search games..."
          className="h-11 w-full rounded-2xl border border-[#284061] bg-[#0a1730] px-11 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          ⌕
        </span>
      </div>
      <p className="mt-1 min-h-5 text-xs text-rose-300" aria-live="polite">
        {error}
      </p>
    </form>
  );
}
