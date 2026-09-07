import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE,
  defaultTaste,
  learnFromMessage,
  loadState,
  makeMessage,
  saveState,
  stylistReply,
  type ChatMessage,
  type JournalEntry,
  type TasteProfile,
} from "./chiti";

type Status = "idle" | "submitted";

type ChitiContextValue = {
  hydrated: boolean;
  messages: ChatMessage[];
  journal: JournalEntry[];
  taste: TasteProfile;
  status: Status;
  send: (text: string) => void;
  reset: () => void;
  toggleSave: (message: ChatMessage) => void;
  isSaved: (text: string) => boolean;
  removeEntry: (id: string) => void;
};

const ChitiContext = createContext<ChitiContextValue | null>(null);

export function ChitiProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [taste, setTaste] = useState<TasteProfile>(defaultTaste);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMessages(loadState<ChatMessage[]>(STORAGE.messages, []));
    setJournal(loadState<JournalEntry[]>(STORAGE.journal, []));
    setTaste(loadState<TasteProfile>(STORAGE.taste, defaultTaste));
    setHydrated(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      const userMessage = makeMessage("user", text);
      setMessages((prev) => {
        const next = [...prev, userMessage];
        saveState(STORAGE.messages, next);
        return next;
      });
      setTaste((prev) => {
        const next = learnFromMessage(prev, text);
        saveState(STORAGE.taste, next);
        return next;
      });
      setStatus("submitted");

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => {
          setMessages((prev) => {
            const turn = prev.filter((m) => m.role === "assistant").length;
            const { text: reply, suggestions } = stylistReply(text, turn);
            const next = [...prev, makeMessage("assistant", reply, suggestions)];
            saveState(STORAGE.messages, next);
            return next;
          });
          setStatus("idle");
        },
        700 + Math.random() * 500
      );
    },
    []
  );

  const reset = useCallback(() => {
    setMessages([]);
    saveState(STORAGE.messages, []);
  }, []);

  const toggleSave = useCallback((message: ChatMessage) => {
    setJournal((prev) => {
      const existing = prev.find((e) => e.text === message.text);
      const next = existing
        ? prev.filter((e) => e.id !== existing.id)
        : [{ id: message.id, text: message.text, savedAt: Date.now() }, ...prev];
      saveState(STORAGE.journal, next);
      return next;
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setJournal((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveState(STORAGE.journal, next);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (text: string) => journal.some((e) => e.text === text),
    [journal]
  );

  const value = useMemo(
    () => ({
      hydrated,
      messages,
      journal,
      taste,
      status,
      send,
      reset,
      toggleSave,
      isSaved,
      removeEntry,
    }),
    [hydrated, messages, journal, taste, status, send, reset, toggleSave, isSaved, removeEntry]
  );

  return <ChitiContext.Provider value={value}>{children}</ChitiContext.Provider>;
}

export function useChiti() {
  const ctx = useContext(ChitiContext);
  if (!ctx) throw new Error("useChiti must be used inside ChitiProvider");
  return ctx;
}
