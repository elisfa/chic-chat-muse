import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useChiti } from "@/lib/chiti-store";
import { formatStamp } from "@/lib/chiti";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Saved Styling Takes | Chiti" },
      {
        name: "description",
        content: "Every stylist verdict you starred, kept with a timestamp and removable anytime.",
      },
      { property: "og:title", content: "Journal — Saved Styling Takes | Chiti" },
      {
        property: "og:description",
        content: "Your archive of saved styling verdicts.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const { journal, removeEntry, hydrated } = useChiti();

  return (
    <section className="py-6">
      <header className="mb-8 border-b border-hairline pb-5">
        <h1 className="text-lg tracking-[0.2em] uppercase">Journal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Takes you kept. {journal.length} saved.
        </p>
      </header>

      {hydrated && journal.length === 0 ? (
        <div className="border border-hairline p-8">
          <p className="text-sm">Nothing saved yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Star a reply in{" "}
            <Link to="/" className="text-foreground underline underline-offset-4">
              chat
            </Link>{" "}
            and it lands here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[color:var(--hairline)] border-y border-hairline">
          {journal.map((entry) => (
            <li key={entry.id} className="group flex gap-5 py-6">
              <div className="min-w-0 flex-1">
                <span className="label-xs text-muted-foreground">{formatStamp(entry.savedAt)}</span>
                <p className="mt-3 text-[15px] leading-relaxed">{entry.text}</p>
              </div>
              <button
                aria-label="Remove"
                onClick={() => removeEntry(entry.id)}
                className="h-7 w-7 shrink-0 border border-hairline text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <X className="mx-auto h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
