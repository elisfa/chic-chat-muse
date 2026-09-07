import { createFileRoute } from "@tanstack/react-router";
import { useChiti } from "@/lib/chiti-store";

export const Route = createFileRoute("/taste")({
  head: () => ({
    meta: [
      { title: "Taste Profile — What Chiti Has Learned" },
      {
        name: "description",
        content:
          "A living summary of your taste: what you gravitate toward, what you avoid, and the budget lane you actually shop in.",
      },
      { property: "og:title", content: "Taste Profile — What Chiti Has Learned" },
      {
        property: "og:description",
        content: "Proof the stylist is learning: your signals, your no-list, your budget lane.",
      },
    ],
  }),
  component: TastePage,
});

function TastePage() {
  const { taste } = useChiti();
  const lowPct = 12;
  const highPct = Math.min(92, 12 + (taste.budgetHigh / 400) * 80);

  return (
    <section className="space-y-12 py-6">
      <header className="border-b border-hairline pb-5">
        <h1 className="text-lg tracking-[0.2em] uppercase">Taste Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Built from {taste.signals} signals across your conversations.
        </p>
      </header>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="label-xs text-muted-foreground">Gravitates toward</h2>
          <span className="label-xs text-muted-foreground">{taste.gravitates.length}</span>
        </div>
        <ul className="flex flex-wrap gap-2">
          {taste.gravitates.map((t) => (
            <li
              key={t}
              className="rounded-full border border-foreground/70 px-3.5 py-2 text-xs text-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="label-xs text-avoid">Avoids</h2>
          <span className="label-xs text-muted-foreground">{taste.avoids.length}</span>
        </div>
        <ul className="flex flex-wrap gap-2">
          {taste.avoids.map((t) => (
            <li
              key={t}
              className="rounded-full border border-avoid/60 bg-avoid/10 px-3.5 py-2 text-xs text-avoid"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="label-xs mb-5 text-muted-foreground">Budget lane</h2>
        <div className="border border-hairline p-6">
          <div className="flex items-baseline justify-between text-sm">
            <span>€{taste.budgetLow}</span>
            <span className="label-xs text-muted-foreground">per piece</span>
            <span>€{taste.budgetHigh}</span>
          </div>
          <div className="relative mt-5 h-px w-full bg-border">
            <div
              className="absolute -top-[3px] h-[7px] bg-foreground"
              style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <span className="label-xs text-muted-foreground">€0</span>
            <span className="label-xs text-muted-foreground">€400+</span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {taste.budgetNote}
          </p>
        </div>
      </div>
    </section>
  );
}
