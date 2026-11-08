"use client";

import { CharacterCreate } from "@/components/game/CharacterCreate";
import { DialogueOverlay } from "@/components/game/DialogueOverlay";
import { HUD } from "@/components/game/HUD";
import { TitleScreen } from "@/components/game/TitleScreen";
import { WorldCanvas } from "@/components/game/WorldCanvas";
import { useGame } from "@/game/store";
import { canManualSave } from "@/game/constants";
import { useEffect } from "react";

export function GameRoot() {
  const mode = useGame((s) => s.mode);

  useEffect(() => {
    window.__game = useGame;
    const onHide = () => {
      const s = useGame.getState();
      if (s.mode === "world" || s.mode === "dialogue") {
        if (canManualSave(s.difficulty) || true) s.save(s.slot);
      }
    };
    const onVis = () => {
      if (document.hidden) onHide();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);

  if (mode === "title") return <TitleScreen />;
  if (mode === "create") return <CharacterCreate />;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-ink">
      <WorldCanvas />
      <HUD />
      {mode === "dialogue" && <DialogueOverlay />}
    </div>
  );
}
