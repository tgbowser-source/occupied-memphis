let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;

export function unlockAudio() {
  try {
    if (started) {
      void ctx?.resume();
      return;
    }
    const AC =
      typeof window === "undefined"
        ? undefined
        : window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);
    started = true;
    drone();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) void ctx?.suspend();
      else void ctx?.resume();
    });
  } catch {
    started = false;
    ctx = null;
    master = null;
  }
}

function drone() {
  if (!ctx || !master) return;
  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 62;
    g.gain.value = 0.35;
    osc.connect(g);
    g.connect(master);
    osc.start();

    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = last * 0.97 + (Math.random() * 2 - 1) * 0.03;
      data[i] = last;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const ng = ctx.createGain();
    ng.gain.value = 0.5;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 480;
    noise.connect(f);
    f.connect(ng);
    ng.connect(master);
    noise.start();
  } catch {
    /* Audio can fail inside a preview iframe; the game still plays. */
  }
}

export function blip(kind: "ui" | "hit" | "warn" = "ui") {
  if (!ctx || !master) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind === "hit" ? "square" : "triangle";
    o.frequency.value = kind === "warn" ? 180 : kind === "hit" ? 90 : 420;
    g.gain.value = 0.2;
    o.connect(g);
    g.connect(master);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.stop(ctx.currentTime + 0.13);
  } catch {
    /* ignore */
  }
}
