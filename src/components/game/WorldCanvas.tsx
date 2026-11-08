import { useEffect, useRef } from "react";
import { canManualSave } from "@/game/constants";
import { getCam, preload, renderWorld, screenToWorld, setPointer } from "@/game/render";
import { advanceDialogue, input, interact, tick } from "@/game/sim";
import { useGame } from "@/game/store";

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      getX: () => number;
      getY: () => number;
      setKeys: (codes: string[]) => void;
      setSteer?: (v: number) => void;
      interact?: () => void;
    };
  }
}

export function WorldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    preload();
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const s = useGame.getState();
      if (down && e.code === "Enter" && s.mode === "dialogue") {
        e.preventDefault();
        advanceDialogue();
        return;
      }
      if (s.mode !== "world") {
        if (down) input.keys.clear();
        return;
      }
      if (down && ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
      if (down) input.keys.add(e.code);
      else input.keys.delete(e.code);
      if (!down) return;
      if (e.code === "KeyE" || e.code === "Enter") interact();
      if (e.code === "KeyI") useGame.getState().setOverlay(s.overlay === "inventory" ? null : "inventory");
      if (e.code === "KeyM") useGame.getState().setOverlay(s.overlay === "map" ? null : "map");
      if (e.code === "Tab") {
        e.preventDefault();
        useGame.getState().setOverlay(s.overlay === "dossier" ? null : "dossier");
      }
      if (e.code === "Escape") {
        if (s.overlay) useGame.getState().setOverlay(null);
        else useGame.getState().setOverlay("pause");
      }
      if (e.code === "KeyH") useGame.getState().setOverlay(s.overlay === "help" ? null : "help");
      if (e.code === "KeyQ" && canManualSave(s.difficulty)) useGame.getState().save(s.slot);
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    const blur = () => input.keys.clear();

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        input.keys.clear();
        const s = useGame.getState();
        if (s.mode === "world" && s.firstName) s.save?.(s.slot);
      }
    });

    window.__controlsTest = {
      getYaw: () => useGame.getState().facing,
      getSpeed: () => useGame.getState().speed,
      getX: () => useGame.getState().x,
      getY: () => useGame.getState().y,
      setKeys: (codes) => {
        input.injected = codes;
      },
      setSteer: (v) => {
        if (v > 0.2) input.injected = ["KeyW", "KeyA"];
        else if (v < -0.2) input.injected = ["KeyW", "KeyD"];
        else input.injected = input.injected?.filter((c) => c === "KeyW") ?? [];
      },
      interact,
    };

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const parent = canvas.parentElement;
      const cw = parent?.clientWidth ?? window.innerWidth;
      const ch = parent?.clientHeight ?? window.innerHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.floor(cw * dpr) || canvas.height !== Math.floor(ch * dpr)) {
        canvas.width = Math.floor(cw * dpr);
        canvas.height = Math.floor(ch * dpr);
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tick(dt);
      renderWorld(ctx, cw, ch, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      input.keys.clear();
      input.injected = null;
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="block h-full w-full touch-none bg-ink"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const { camX, camY } = getCam();
        const world = screenToWorld(e.clientX - r.left, e.clientY - r.top);
        input.mx = world.x;
        input.my = world.y;
        setPointer(e.clientX - r.left + camX, e.clientY - r.top + camY);
      }}
      onMouseDown={(e) => {
        if (e.button === 0) input.attack = true;
      }}
    />
  );
}
