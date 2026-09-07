import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, RotateCcw } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useChiti } from "@/lib/chiti-store";
import { formatStamp, openers } from "@/lib/chiti";
import mark from "@/assets/chiti-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chiti — Your Personal AI Stylist, On Text" },
      {
        name: "description",
        content:
          "Chiti is a chat-based styling journal. Ask what to wear, get blunt, decisive answers, and watch it learn your taste.",
      },
      { property: "og:title", content: "Chiti — Your Personal AI Stylist, On Text" },
      {
        property: "og:description",
        content: "A cold, decisive stylist in your pocket. It remembers what you like.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { hydrated, messages, status, send, reset, toggleSave, isSaved } = useChiti();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status, messages.length]);

  const submit = (text: string) => {
    if (!text.trim() || status === "submitted") return;
    send(text);
    setDraft("");
    inputRef.current?.focus();
  };

  const last = messages[messages.length - 1];
  const chips =
    status === "idle" && last?.role === "assistant" && last.suggestions ? last.suggestions : [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between py-4">
        <span className="label-xs text-muted-foreground">
          {messages.length ? `${messages.length} exchanges` : "new thread"}
        </span>
        {messages.length > 0 && (
          <button
            onClick={reset}
            className="label-xs inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" /> clear
          </button>
        )}
      </div>

      <Conversation className="min-h-[52vh] flex-1">
        <ConversationContent className="gap-7 px-0">
          {hydrated && messages.length === 0 && (
            <div className="flex flex-col items-start gap-6 border border-hairline p-7">
              <img src={mark} alt="" width={816} height={816} loading="lazy" className="h-7 w-7" />
              <div className="space-y-2">
                <p className="text-base">Tell me what you're getting dressed for.</p>
                <p className="text-sm text-muted-foreground">
                  I'll be short about it. The more you tell me, the sharper I get.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {openers.map((o) => (
                  <button
                    key={o}
                    onClick={() => submit(o)}
                    className="rounded-full border border-hairline px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Message key={m.id} from={m.role} className="max-w-full">
              <MessageContent
                className={
                  m.role === "user"
                    ? "group-[.is-user]:rounded-none group-[.is-user]:bg-foreground group-[.is-user]:text-background group-[.is-user]:max-w-[80%]"
                    : "max-w-[88%] border-l border-hairline pl-4"
                }
              >
                {m.role === "assistant" ? (
                  <MessageResponse className="text-[15px] leading-relaxed">
                    {m.text}
                  </MessageResponse>
                ) : (
                  <p className="text-[15px] leading-relaxed">{m.text}</p>
                )}
              </MessageContent>

              {m.role === "assistant" && (
                <div className="flex items-center gap-3 pl-4">
                  <span className="label-xs text-muted-foreground">{formatStamp(m.createdAt)}</span>
                  <button
                    onClick={() => toggleSave(m)}
                    className="label-xs inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {isSaved(m.text) ? (
                      <>
                        <BookmarkCheck className="h-3 w-3" /> saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-3 w-3" /> save
                      </>
                    )}
                  </button>
                </div>
              )}
            </Message>
          ))}

          {status === "submitted" && (
            <div className="border-l border-hairline pl-4">
              <Shimmer className="text-[15px]">Thinking</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 py-4">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => submit(c)}
              className="rounded-full border border-hairline px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <PromptInput
        className="rounded-none border border-hairline bg-surface"
        onSubmit={(_msg, event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <PromptInputTextarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="what are we working with today"
          className="min-h-[64px] bg-transparent text-[15px]"
        />
        <PromptInputFooter className="justify-end border-0 px-2 pb-2">
          <PromptInputSubmit
            className="rounded-none"
            status={status === "submitted" ? "submitted" : "ready"}
            disabled={!draft.trim() || status === "submitted"}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
