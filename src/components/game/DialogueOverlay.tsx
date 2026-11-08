import { ASSETS } from "@/game/constants";
import { DIALOGUE, portraitSrc, resolveText } from "@/game/data/dialogue";
import { advanceDialogue } from "@/game/sim";
import { useGame } from "@/game/store";
import { useEffect, useMemo, useState } from "react";

export function DialogueOverlay() {
  const id = useGame((s) => s.dialogueId);
  const s = useGame();
  const node = id ? DIALOGUE[id] : null;
  const resolved = node ? resolveText(node, s) : null;
  const [shown, setShown] = useState(0);

  const text = resolved?.text ?? "";
  useEffect(() => {
    setShown(0);
    if (!text) return;
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) window.clearInterval(t);
    }, 16);
    return () => window.clearInterval(t);
  }, [id, text]);

  const done = shown >= text.length;
  const visible = text.slice(0, shown);
  const pKey = resolved ? portraitSrc(resolved.portrait, s) : undefined;
  const portrait = pKey ? (ASSETS.portraits as Record<string, string>)[pKey] : undefined;
  const scene = resolved?.scene ? (ASSETS.scenes as Record<string, string>)[resolved.scene] : undefined;

  const choices = useMemo(() => {
    if (!node?.choices) return [];
    return node.choices.filter((c) => !c.req || c.req(s));
  }, [node, s.flags, s.items, s.stats, s.dead]);

  if (!node || !resolved) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      {scene && (
        <img src={scene} alt="" className="absolute inset-0 h-full w-full object-cover" crossOrigin="anonymous" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/25" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pb-8 pt-10">
        <div className="flex items-end gap-4">
          {portrait && (
            <img
              src={portrait}
              alt=""
              crossOrigin="anonymous"
              className="hidden h-40 w-28 shrink-0 object-cover object-top shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:block"
            />
          )}
          <div className="min-w-0 flex-1 border border-paper/15 bg-ink/80 p-5 backdrop-blur-sm">
            <p className="text-xs tracking-[0.22em] text-paper/55 uppercase">{resolved.speaker}</p>
            <p className="font-display mt-2 text-lg leading-snug text-paper sm:text-xl">{visible}</p>
            {!!choices.length && !done && (
              <button
                className="mt-5 text-xs tracking-[0.2em] text-paper/50 uppercase"
                onClick={() => setShown(text.length)}
              >
                Skip
              </button>
            )}
            {!!choices.length && done && (
              <div className="mt-5 grid gap-2">
                {choices.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => advanceDialogue(i)}
                    className="border border-paper/25 px-3 py-3 text-left text-sm text-paper hover:bg-paper/10"
                  >
                    {c.label}
                    {c.hint && <span className="ml-2 text-[11px] tracking-wide text-paper/45 uppercase">{c.hint}</span>}
                  </button>
                ))}
              </div>
            )}
            {!choices.length && (
              <button
                className="mt-5 text-xs tracking-[0.2em] text-paper/50 uppercase"
                onClick={() => {
                  if (!done) setShown(text.length);
                  else advanceDialogue();
                }}
              >
                {done ? "Continue" : "Skip"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
