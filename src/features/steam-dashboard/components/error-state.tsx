type ErrorStateProps = {
  message: string;
  requestedUser: string;
};

export function ErrorState({ message, requestedUser }: ErrorStateProps) {
  return (
    <section className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-rose-50 shadow-xl shadow-black/20">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-200">
        Lookup failed
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
        We couldn&apos;t load that Steam profile
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-rose-100/85">
        {message}
      </p>
      <p className="mt-4 text-sm leading-7 text-rose-100/70">
        Search attempted for <code>{requestedUser}</code>. Use a numeric Steam
        ID64 or the exact custom profile name from
        <code> steamcommunity.com/id/&lt;name&gt;</code>.
      </p>
    </section>
  );
}
