let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    return audioCtx;
};

export const playCelebrationChime = async () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.connect(ctx.destination);

        const notes = [
            { freq: 523.25, start: 0, duration: 0.13 },
            { freq: 659.25, start: 0.09, duration: 0.14 },
            { freq: 783.99, start: 0.18, duration: 0.2 },
        ];

        notes.forEach((note) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(note.freq, now + note.start);

            gain.gain.setValueAtTime(0.0001, now + note.start);
            gain.gain.exponentialRampToValueAtTime(0.08, now + note.start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);

            osc.connect(gain);
            gain.connect(master);
            osc.start(now + note.start);
            osc.stop(now + note.start + note.duration);
        });

        master.gain.exponentialRampToValueAtTime(0.75, now + 0.01);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    } catch {
        // Silent fallback: audio can fail on some mobile/browser contexts.
    }
};

