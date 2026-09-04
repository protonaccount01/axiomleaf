/**
 * UTILITIES – stopwatch, countdown, image→Base64, text-to-speech, notepad…
 */
import { useEffect, useRef, useState } from "react";
import { Actions, CopyButton, Field, Input, Result, Select, TextArea, downloadText } from "../shared/ToolUI";

/* ─── Stopwatch ─── */
export function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef<number | null>(null);
  const start = useRef(0);
  useEffect(() => {
    if (running) {
      start.current = Date.now() - ms;
      ref.current = window.setInterval(() => setMs(Date.now() - start.current), 31);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps
  const f = (t: number) => `${String(Math.floor(t / 60000)).padStart(2, "0")}:${String(Math.floor((t % 60000) / 1000)).padStart(2, "0")}.${String(Math.floor((t % 1000) / 10)).padStart(2, "0")}`;
  return (
    <div className="space-y-5 text-center">
      <div className="font-mono text-6xl font-bold tracking-tight text-ink tabular-nums">{f(ms)}</div>
      <Actions>
        <div className="mx-auto flex gap-2">
          <button type="button" className={running ? "btn-dark" : "btn-primary"} onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</button>
          <button type="button" className="btn-ghost" disabled={!running} onClick={() => setLaps([ms, ...laps])}>Lap</button>
          <button type="button" className="btn-ghost" onClick={() => { setRunning(false); setMs(0); setLaps([]); }}>Reset</button>
        </div>
      </Actions>
      {laps.length > 0 && (
        <ol className="mx-auto max-w-xs divide-y divide-ink/5 rounded-xl border border-ink/10 text-sm">
          {laps.map((l, i) => (
            <li key={i} className="flex justify-between px-4 py-2 font-mono"><span className="text-ink/50">Lap {laps.length - i}</span><span>{f(l)}</span></li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ─── Countdown Timer ─── */
export function CountdownTimer() {
  const [mins, setMins] = useState(5);
  const [left, setLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((l) => {
      if (l <= 1) { clearInterval(id); setRunning(false); setDone(true); return 0; }
      return l - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running]);
  const reset = (m = mins) => { setRunning(false); setDone(false); setLeft(m * 60); };
  const pct = mins ? (left / (mins * 60)) * 100 : 0;
  return (
    <div className="space-y-5 text-center">
      <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full" style={{ background: `conic-gradient(#22c55e ${pct}%, #dcfce7 0)` }}>
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white font-mono text-4xl font-bold tabular-nums">
          {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
        </div>
      </div>
      {done && <p className="font-semibold text-leaf-700">⏰ Time's up!</p>}
      <div className="mx-auto flex max-w-sm items-end gap-2">
        <Field label="Minutes" className="flex-1 text-left">
          <Input type="number" min={1} max={999} value={mins} onChange={(e) => { const m = Math.max(1, +e.target.value); setMins(m); reset(m); }} />
        </Field>
        <button type="button" className={running ? "btn-dark" : "btn-primary"} onClick={() => setRunning(!running)}>{running ? "Pause" : "Start"}</button>
        <button type="button" className="btn-ghost" onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
}

/* ─── Image to Base64 ─── */
export function ImageToBase64() {
  const [data, setData] = useState("");
  const [meta, setMeta] = useState("");
  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setMeta("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setMeta("Max size is 5 MB.");
    const reader = new FileReader();
    reader.onload = () => { setData(String(reader.result)); setMeta(`${file.name} · ${(file.size / 1024).toFixed(1)} KB · ${file.type}`); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-ink/15 bg-leaf-50/40 px-4 py-10 text-sm text-ink/60 hover:border-leaf-500"
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}>
        <span className="font-medium text-ink">Drop an image here or click to browse</span>
        <span className="mt-1 text-xs">PNG, JPG, GIF, WebP, SVG · up to 5 MB</span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>
      {meta && <p className="text-xs text-ink/60">{meta}</p>}
      {data && (
        <>
          <img src={data} alt="Preview" className="max-h-48 rounded-xl border border-ink/10" />
          <Actions>
            <CopyButton text={data} label="Copy data URL" />
            <CopyButton text={`<img src="${data}" alt="">`} label="Copy <img> tag" />
            <CopyButton text={`background-image: url(${data});`} label="Copy CSS" />
          </Actions>
          <TextArea value={data} readOnly rows={6} aria-label="Base64 output" />
        </>
      )}
      <p className="text-xs text-ink/50">Conversion runs entirely in your browser using the FileReader API. Your image is never uploaded.</p>
    </div>
  );
}

/* ─── Text to Speech ─── */
export function TextToSpeech() {
  const [text, setText] = useState("Hello! I am your browser's built-in voice.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  useEffect(() => {
    if (!supported) return;
    const load = () => { const v = speechSynthesis.getVoices(); setVoices(v); if (!voice && v[0]) setVoice(v[0].name); };
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, [supported, voice]);
  const speak = () => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voices.find((v) => v.name === voice) ?? null;
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(u);
  };
  if (!supported) return <p className="text-sm text-red-600">Your browser does not support the Web Speech API.</p>;
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} rows={5} aria-label="Text to speak" />
      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
        <Field label="Voice">
          <Select value={voice} onChange={setVoice} options={voices.map((v) => ({ value: v.name, label: `${v.name} (${v.lang})` }))} />
        </Field>
        <Field label={`Speed: ${rate}×`}>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="mt-3 w-full accent-leaf-600" />
        </Field>
      </div>
      <Actions>
        <button type="button" className="btn-primary" onClick={speak} disabled={!text}>▶ Speak</button>
        <button type="button" className="btn-ghost" onClick={() => { speechSynthesis.cancel(); setSpeaking(false); }} disabled={!speaking}>■ Stop</button>
      </Actions>
    </div>
  );
}

/* ─── Online Notepad (localStorage) ─── */
const NOTE_KEY = "axiomleaf.notepad";
export function Notepad() {
  const [text, setText] = useState(() => localStorage.getItem(NOTE_KEY) ?? "");
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    setSaved(false);
    const id = setTimeout(() => { localStorage.setItem(NOTE_KEY, text); setSaved(true); }, 400);
    return () => clearTimeout(id);
  }, [text]);
  return (
    <div className="space-y-3">
      <Actions>
        <span className="badge">{saved ? "Saved locally ✓" : "Saving…"}</span>
        <span className="text-xs text-ink/50">{text.length} chars</span>
        <CopyButton text={text} />
        <button type="button" className="btn-ghost !py-1.5 !px-3 text-xs" disabled={!text} onClick={() => downloadText("note.txt", text)}>Download .txt</button>
        <button type="button" className="btn-ghost !py-1.5 !px-3 text-xs" onClick={() => setText("")}>Clear</button>
      </Actions>
      <TextArea value={text} onChange={setText} rows={16} placeholder="Start typing – your note auto-saves in this browser only." aria-label="Notepad" className="!font-sans !text-[15px]" />
    </div>
  );
}

/* ─── Social Character Counter ─── */
const LIMITS = [["X / Twitter post", 280], ["Instagram caption", 2200], ["Meta title", 60], ["Meta description", 160], ["LinkedIn post", 3000], ["SMS", 160], ["YouTube title", 100]] as const;
export function CharCounter() {
  const [text, setText] = useState("");
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} rows={6} placeholder="Draft your post here…" aria-label="Text" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LIMITS.map(([name, lim]) => {
          const over = text.length > lim;
          return (
            <div key={name} className={`rounded-xl border px-4 py-3 ${over ? "border-red-200 bg-red-50" : "border-ink/10 bg-white"}`}>
              <div className="text-xs font-medium text-ink/55">{name}</div>
              <div className={`mt-0.5 font-mono text-sm font-semibold ${over ? "text-red-600" : "text-ink"}`}>{text.length} / {lim}</div>
              <div className="mt-2 h-1.5 rounded-full bg-ink/5"><div className={`h-1.5 rounded-full ${over ? "bg-red-500" : "bg-leaf-500"}`} style={{ width: `${Math.min(100, (text.length / lim) * 100)}%` }} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Screen / Device Info ─── */
export function DeviceInfo() {
  const [info, setInfo] = useState<Record<string, string>>({});
  useEffect(() => {
    const upd = () => setInfo({
      "Viewport": `${window.innerWidth} × ${window.innerHeight}`,
      "Screen": `${screen.width} × ${screen.height}`,
      "Pixel ratio": String(window.devicePixelRatio),
      "Color depth": `${screen.colorDepth}-bit`,
      "Language": navigator.language,
      "Platform": navigator.platform || "—",
      "Online": navigator.onLine ? "Yes" : "No",
      "Cookies enabled": navigator.cookieEnabled ? "Yes" : "No",
      "Touch support": "ontouchstart" in window ? "Yes" : "No",
      "Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
      "User agent": navigator.userAgent,
    });
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(info).map(([k, v]) => <Result key={k} label={k} value={v} mono={k === "User agent"} />)}
    </div>
  );
}
