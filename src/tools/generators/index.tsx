/**
 * GENERATORS – passwords, QR codes, CSS gradients, shadows, palettes…
 */
import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Actions, CopyButton, Field, Input, Result, Row, Select, TextArea } from "../shared/ToolUI";

/* ─── Password Generator ─── */
export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [pw, setPw] = useState("");
  const gen = () => {
    const sets = {
      upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
      lower: "abcdefghijkmnopqrstuvwxyz",
      digits: "23456789",
      symbols: "!@#$%^&*()-_=+[]{};:,.?",
    };
    const pool = (Object.keys(sets) as (keyof typeof sets)[]).filter((k) => opts[k]).map((k) => sets[k]).join("");
    if (!pool) return setPw("");
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setPw([...arr].map((n) => pool[n % pool.length]).join(""));
  };
  useEffect(gen, [len, opts]); // eslint-disable-line react-hooks/exhaustive-deps
  const entropy = Math.round(len * Math.log2(Object.values(opts).filter(Boolean).length * 20 || 1));
  const strength = entropy > 90 ? "Very strong" : entropy > 60 ? "Strong" : entropy > 40 ? "Fair" : "Weak";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-leaf-50/50 px-4 py-3">
        <code className="flex-1 break-all font-mono text-lg">{pw}</code>
        <CopyButton text={pw} />
        <button type="button" className="btn-primary !py-1.5 !px-3 text-xs" onClick={gen}>Regenerate</button>
      </div>
      <Field label={`Length: ${len}`}>
        <input type="range" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full accent-leaf-600" />
      </Field>
      <Actions>
        {(["upper", "lower", "digits", "symbols"] as const).map((k) => (
          <label key={k} className="flex items-center gap-2 text-sm capitalize">
            <input type="checkbox" checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} /> {k}
          </label>
        ))}
        <span className="badge">{strength} · ~{entropy} bits</span>
      </Actions>
      <p className="text-xs text-ink/50">Generated with the Web Crypto API (cryptographically secure). Nothing is stored or transmitted.</p>
    </div>
  );
}

/* ─── QR Code Generator ─── */
export function QrGenerator() {
  const [text, setText] = useState("https://axiomleaf.pages.dev");
  const [size, setSize] = useState(256);
  const [dataUrl, setDataUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!text || !canvasRef.current) return setDataUrl("");
    QRCode.toCanvas(canvasRef.current, text, { width: size, margin: 2, color: { dark: "#0b0f0d", light: "#ffffff" } })
      .then(() => setDataUrl(canvasRef.current?.toDataURL("image/png") ?? ""))
      .catch(() => setDataUrl(""));
  }, [text, size]);
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <Field label="Text or URL">
          <TextArea value={text} onChange={setText} rows={4} />
        </Field>
        <Field label={`Size: ${size}px`}>
          <input type="range" min={128} max={1024} step={32} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-leaf-600" />
        </Field>
        <a href={dataUrl || undefined} download="qrcode.png" className={`btn-primary ${!dataUrl && "pointer-events-none opacity-50"}`}>
          Download PNG
        </a>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-ink/10 bg-white p-4">
        <canvas ref={canvasRef} className="max-w-full" style={{ width: Math.min(size, 256), height: Math.min(size, 256) }} />
      </div>
    </div>
  );
}

/* ─── Gradient Generator ─── */
export function GradientGenerator() {
  const [c1, setC1] = useState("#22c55e");
  const [c2, setC2] = useState("#0b0f0d");
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState("linear");
  const css = type === "linear" ? `linear-gradient(${angle}deg, ${c1}, ${c2})` : `radial-gradient(circle, ${c1}, ${c2})`;
  return (
    <div className="space-y-4">
      <div className="h-40 rounded-xl border border-ink/10" style={{ background: css }} />
      <Row className="sm:grid-cols-4">
        <Field label="Start">
          <input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="h-11 w-full rounded-lg border border-ink/10" />
        </Field>
        <Field label="End">
          <input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="h-11 w-full rounded-lg border border-ink/10" />
        </Field>
        <Field label="Type">
          <Select value={type} onChange={setType} options={[{ value: "linear", label: "Linear" }, { value: "radial", label: "Radial" }]} />
        </Field>
        <Field label={`Angle: ${angle}°`}>
          <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="mt-3 w-full accent-leaf-600" disabled={type !== "linear"} />
        </Field>
      </Row>
      <div className="flex items-center gap-3">
        <div className="flex-1"><Result label="CSS" value={`background: ${css};`} /></div>
        <CopyButton text={`background: ${css};`} />
      </div>
    </div>
  );
}

/* ─── Box Shadow Generator ─── */
export function BoxShadowGenerator() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(30);
  const [spread, setSpread] = useState(-8);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState("#0b0f0d");
  const hexA = color + Math.round((opacity / 100) * 255).toString(16).padStart(2, "0");
  const css = `${x}px ${y}px ${blur}px ${spread}px ${hexA}`;
  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <Field label={`${label}: ${v}`}>
      <input type="range" min={min} max={max} value={v} onChange={(e) => set(+e.target.value)} className="w-full accent-leaf-600" />
    </Field>
  );
  return (
    <div className="space-y-4">
      <div className="flex h-48 items-center justify-center rounded-xl bg-leaf-50/40">
        <div className="h-24 w-40 rounded-xl bg-white" style={{ boxShadow: css }} />
      </div>
      <Row className="sm:grid-cols-3">
        {slider("Offset X", x, setX, -50, 50)}
        {slider("Offset Y", y, setY, -50, 50)}
        {slider("Blur", blur, setBlur, 0, 100)}
        {slider("Spread", spread, setSpread, -50, 50)}
        {slider("Opacity %", opacity, setOpacity, 0, 100)}
        <Field label="Colour">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-full rounded-lg border border-ink/10" />
        </Field>
      </Row>
      <div className="flex items-center gap-3">
        <div className="flex-1"><Result label="CSS" value={`box-shadow: ${css};`} /></div>
        <CopyButton text={`box-shadow: ${css};`} />
      </div>
    </div>
  );
}

/* ─── Random Number Generator ─── */
export function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  const gen = () => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const range = hi - lo + 1;
    const n = unique ? Math.min(count, range) : count;
    const res: number[] = [];
    const used = new Set<number>();
    while (res.length < n) {
      const v = lo + Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * range);
      if (unique && used.has(v)) continue;
      used.add(v);
      res.push(v);
    }
    setOut(res);
  };
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Min"><Input type="number" value={min} onChange={(e) => setMin(+e.target.value)} /></Field>
        <Field label="Max"><Input type="number" value={max} onChange={(e) => setMax(+e.target.value)} /></Field>
        <Field label="How many"><Input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Math.max(1, Math.min(1000, +e.target.value)))} /></Field>
      </Row>
      <Actions>
        <button type="button" className="btn-primary" onClick={gen}>Generate</button>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats</label>
        <CopyButton text={out.join(", ")} />
      </Actions>
      {out.length > 0 && (
        <div className="rounded-xl border border-ink/10 bg-leaf-50/50 p-4 text-center">
          {out.length === 1 ? <span className="text-5xl font-extrabold text-leaf-700">{out[0]}</span> : <span className="font-mono text-sm break-all">{out.join(", ")}</span>}
        </div>
      )}
    </div>
  );
}

/* ─── Color Palette Generator ─── */
function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return "#" + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");
}
export function PaletteGenerator() {
  const [seed, setSeed] = useState(142);
  const [scheme, setScheme] = useState("analogous");
  const palette = useMemo(() => {
    const hues: number[] =
      scheme === "complementary" ? [0, 180, 30, 210, 0] :
      scheme === "triadic" ? [0, 120, 240, 60, 180] :
      scheme === "monochrome" ? [0, 0, 0, 0, 0] : [-30, -15, 0, 15, 30];
    const lights = scheme === "monochrome" ? [25, 40, 55, 70, 85] : [45, 50, 55, 50, 45];
    return hues.map((h, i) => hslToHex((seed + h + 360) % 360, 65, lights[i]));
  }, [seed, scheme]);
  const randomize = () => setSeed(Math.floor(Math.random() * 360));
  return (
    <div className="space-y-4">
      <div className="grid h-40 grid-cols-5 overflow-hidden rounded-xl border border-ink/10">
        {palette.map((c) => (
          <button key={c} type="button" title={`Copy ${c}`} onClick={() => navigator.clipboard.writeText(c)} style={{ background: c }} className="flex items-end justify-center pb-3 font-mono text-xs text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
            {c}
          </button>
        ))}
      </div>
      <Row className="sm:grid-cols-3">
        <Field label={`Base hue: ${seed}°`}>
          <input type="range" min={0} max={359} value={seed} onChange={(e) => setSeed(+e.target.value)} className="mt-3 w-full accent-leaf-600" />
        </Field>
        <Field label="Scheme">
          <Select value={scheme} onChange={setScheme} options={["analogous", "complementary", "triadic", "monochrome"].map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />
        </Field>
        <div className="flex items-end gap-2">
          <button type="button" className="btn-primary" onClick={randomize}>Randomize</button>
          <CopyButton text={palette.join(", ")} label="Copy all" />
        </div>
      </Row>
    </div>
  );
}

/* ─── Meta Tag Generator ─── */
export function MetaTagGenerator() {
  const [f, setF] = useState({ title: "", description: "", url: "", image: "", siteName: "" });
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const esc = (s: string) => s.replace(/"/g, "&quot;");
  const out = [
    `<title>${f.title}</title>`,
    `<meta name="description" content="${esc(f.description)}">`,
    `<link rel="canonical" href="${f.url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(f.title)}">`,
    `<meta property="og:description" content="${esc(f.description)}">`,
    `<meta property="og:url" content="${f.url}">`,
    f.image && `<meta property="og:image" content="${f.image}">`,
    f.siteName && `<meta property="og:site_name" content="${esc(f.siteName)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(f.title)}">`,
    `<meta name="twitter:description" content="${esc(f.description)}">`,
    f.image && `<meta name="twitter:image" content="${f.image}">`,
  ].filter(Boolean).join("\n");
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Page title" hint={`${f.title.length}/60`}><Input value={f.title} onChange={upd("title")} maxLength={70} /></Field>
        <Field label="Site name"><Input value={f.siteName} onChange={upd("siteName")} /></Field>
      </Row>
      <Field label="Description" hint={`${f.description.length}/160`}><Input value={f.description} onChange={upd("description")} maxLength={200} /></Field>
      <Row>
        <Field label="Canonical URL"><Input value={f.url} onChange={upd("url")} placeholder="https://" /></Field>
        <Field label="Image URL"><Input value={f.image} onChange={upd("image")} placeholder="https://…/og.png" /></Field>
      </Row>
      <TextArea value={out} readOnly rows={12} aria-label="Generated meta tags" />
      <CopyButton text={out} />
    </div>
  );
}
