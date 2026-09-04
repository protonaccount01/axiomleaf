/**
 * CONVERTERS – colours, units, temperature, timestamps, number bases…
 */
import { useMemo, useState } from "react";
import { CopyButton, Field, Input, Result, Row, Select, TextArea } from "../shared/ToolUI";

/* ─── Color Converter ─── */
function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.length === 4 ? "#" + [...hex.slice(1)].map((c) => c + c).join("") : hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
export function ColorConverter() {
  const [hex, setHex] = useState("#22c55e");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb
    ? (() => {
        const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
        const k = 1 - Math.max(r, g, b);
        if (k === 1) return "0%, 0%, 0%, 100%";
        return [((1 - r - k) / (1 - k)), ((1 - g - k) / (1 - k)), ((1 - b - k) / (1 - k)), k].map((v) => Math.round(v * 100) + "%").join(", ");
      })()
    : "";
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input type="color" value={rgb ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-ink/10" aria-label="Pick color" />
        <Input value={hex} onChange={(e) => setHex(e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value)} className="font-mono" aria-label="HEX" />
      </div>
      {rgb && hsl ? (
        <>
          <div className="h-20 rounded-xl border border-ink/10" style={{ background: hex }} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="HEX" value={hex.toLowerCase()} />
            <Result label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            <Result label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
            <Result label="CMYK" value={cmyk} />
          </div>
        </>
      ) : (
        <p className="text-sm text-red-600">Enter a valid HEX colour, e.g. #1a2b3c</p>
      )}
    </div>
  );
}

/* ─── Unit Converter ─── */
const UNITS: Record<string, Record<string, number>> = {
  Length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  Weight: { Kilogram: 1, Gram: 0.001, Milligram: 1e-6, Pound: 0.45359237, Ounce: 0.028349523, Tonne: 1000 },
  Area: { "Square meter": 1, "Square kilometer": 1e6, "Square foot": 0.09290304, Acre: 4046.8564, Hectare: 10000 },
  Volume: { Liter: 1, Milliliter: 0.001, "Cubic meter": 1000, "US gallon": 3.785411784, "US cup": 0.2365882365, Tablespoon: 0.01478676 },
  Speed: { "m/s": 1, "km/h": 0.277777778, mph: 0.44704, Knot: 0.514444444 },
  "Data size": { Byte: 1, Kilobyte: 1024, Megabyte: 1024 ** 2, Gigabyte: 1024 ** 3, Terabyte: 1024 ** 4 },
  Time: { Second: 1, Minute: 60, Hour: 3600, Day: 86400, Week: 604800 },
};
export function UnitConverter() {
  const [cat, setCat] = useState("Length");
  const units = Object.keys(UNITS[cat]);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [val, setVal] = useState("1");
  const changeCat = (c: string) => { setCat(c); setFrom(Object.keys(UNITS[c])[0]); setTo(Object.keys(UNITS[c])[1]); };
  const result = useMemo(() => {
    const n = parseFloat(val);
    if (isNaN(n) || !UNITS[cat][from] || !UNITS[cat][to]) return "";
    const r = (n * UNITS[cat][from]) / UNITS[cat][to];
    return Number(r.toPrecision(10)).toString();
  }, [val, cat, from, to]);
  const opts = (arr: string[]) => arr.map((u) => ({ value: u, label: u }));
  return (
    <div className="space-y-4">
      <Field label="Category">
        <Select value={cat} onChange={changeCat} options={opts(Object.keys(UNITS))} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="From">
          <Input type="number" value={val} onChange={(e) => setVal(e.target.value)} />
          <Select value={from} onChange={setFrom} options={opts(units)} className="mt-2" aria-label="From unit" />
        </Field>
        <Field label="To">
          <Input value={result} readOnly className="bg-leaf-50/50 font-semibold" />
          <Select value={to} onChange={setTo} options={opts(units)} className="mt-2" aria-label="To unit" />
        </Field>
      </div>
    </div>
  );
}

/* ─── Temperature Converter ─── */
export function TemperatureConverter() {
  const [c, setC] = useState("25");
  const n = parseFloat(c);
  const f = isNaN(n) ? "" : (n * 9) / 5 + 32;
  const k = isNaN(n) ? "" : n + 273.15;
  const fmt = (v: number | string) => (typeof v === "number" ? Number(v.toFixed(2)).toString() : "");
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Celsius (°C)">
          <Input type="number" value={c} onChange={(e) => setC(e.target.value)} />
        </Field>
        <Field label="Fahrenheit (°F)">
          <Input type="number" value={fmt(f)} onChange={(e) => setC(String(((parseFloat(e.target.value) - 32) * 5) / 9))} />
        </Field>
        <Field label="Kelvin (K)">
          <Input type="number" value={fmt(k)} onChange={(e) => setC(String(parseFloat(e.target.value) - 273.15))} />
        </Field>
      </Row>
    </div>
  );
}

/* ─── Unix Timestamp Converter ─── */
export function TimestampConverter() {
  const [ts, setTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [iso, setIso] = useState("");
  const date = useMemo(() => {
    const n = Number(ts);
    if (!ts || isNaN(n)) return null;
    const d = new Date(n < 1e12 ? n * 1000 : n);
    return isNaN(d.getTime()) ? null : d;
  }, [ts]);
  const fromIso = useMemo(() => {
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }, [iso]);
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Field label="Unix timestamp (seconds or milliseconds)">
          <div className="flex gap-2">
            <Input value={ts} onChange={(e) => setTs(e.target.value)} className="font-mono" />
            <button type="button" className="btn-ghost whitespace-nowrap" onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Now</button>
          </div>
        </Field>
        {date && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="UTC" value={date.toUTCString()} mono={false} />
            <Result label="Local" value={date.toLocaleString()} mono={false} />
            <Result label="ISO 8601" value={date.toISOString()} />
            <Result label="Relative" value={relative(date)} mono={false} />
          </div>
        )}
      </div>
      <div className="space-y-3">
        <Field label="Date/time → timestamp">
          <Input type="datetime-local" value={iso} onChange={(e) => setIso(e.target.value)} />
        </Field>
        {fromIso && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="Seconds" value={Math.floor(fromIso.getTime() / 1000)} />
            <Result label="Milliseconds" value={fromIso.getTime()} />
          </div>
        )}
      </div>
    </div>
  );
}
function relative(d: Date) {
  const diff = (d.getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [[31536000, "year"], [2592000, "month"], [86400, "day"], [3600, "hour"], [60, "minute"], [1, "second"]];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  for (const [s, u] of units) if (abs >= s) return rtf.format(Math.round(diff / s), u);
  return "now";
}

/* ─── Number Base Converter ─── */
export function BaseConverter() {
  const [val, setVal] = useState("255");
  const [base, setBase] = useState("10");
  const n = useMemo(() => {
    const clean = val.trim().replace(/^0[xbo]/i, "");
    if (!clean) return null;
    const parsed = parseInt(clean, Number(base));
    return isNaN(parsed) ? null : parsed;
  }, [val, base]);
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Value">
          <Input value={val} onChange={(e) => setVal(e.target.value)} className="font-mono" />
        </Field>
        <Field label="Input base">
          <Select value={base} onChange={setBase} options={[{ value: "2", label: "Binary (2)" }, { value: "8", label: "Octal (8)" }, { value: "10", label: "Decimal (10)" }, { value: "16", label: "Hexadecimal (16)" }]} />
        </Field>
      </Row>
      {n === null ? (
        <p className="text-sm text-red-600">Invalid number for the selected base.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <Result label="Binary" value={n.toString(2)} />
          <Result label="Octal" value={n.toString(8)} />
          <Result label="Decimal" value={n.toString(10)} />
          <Result label="Hexadecimal" value={n.toString(16).toUpperCase()} />
        </div>
      )}
    </div>
  );
}

/* ─── Roman Numeral Converter ─── */
const ROMAN: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const toRoman = (n: number) => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, "");
const fromRoman = (s: string) => {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]], next = map[s[i + 1]];
    if (!cur) return NaN;
    total += next > cur ? -cur : cur;
  }
  return total;
};
export function RomanNumerals() {
  const [num, setNum] = useState("2025");
  const [rom, setRom] = useState("MMXXV");
  return (
    <Row>
      <Field label="Number (1–3999)">
        <Input type="number" min={1} max={3999} value={num} onChange={(e) => { setNum(e.target.value); const n = +e.target.value; setRom(n >= 1 && n <= 3999 ? toRoman(n) : ""); }} />
      </Field>
      <Field label="Roman numeral">
        <Input value={rom} onChange={(e) => { const v = e.target.value.toUpperCase(); setRom(v); const n = fromRoman(v); setNum(isNaN(n) ? "" : String(n)); }} className="font-mono uppercase" />
      </Field>
    </Row>
  );
}

/* ─── Binary ⇄ Text ─── */
export function BinaryText() {
  const [text, setText] = useState("Hi");
  const [bin, setBin] = useState("01001000 01101001");
  const onText = (t: string) => { setText(t); setBin([...new TextEncoder().encode(t)].map((b) => b.toString(2).padStart(8, "0")).join(" ")); };
  const onBin = (b: string) => {
    setBin(b);
    const bytes = b.trim().split(/\s+/).filter(Boolean).map((x) => parseInt(x, 2));
    if (bytes.every((x) => !isNaN(x) && x >= 0 && x < 256)) setText(new TextDecoder().decode(Uint8Array.from(bytes)));
  };
  return (
    <Row>
      <Field label="Text">
        <TextArea value={text} onChange={onText} rows={6} />
      </Field>
      <Field label="Binary (8-bit, space separated)">
        <TextArea value={bin} onChange={onBin} rows={6} />
      </Field>
    </Row>
  );
}

/* ─── CSV ⇄ JSON ─── */
export function CsvJson() {
  const [csv, setCsv] = useState("name,age,city\nAlice,30,Berlin\nBob,25,Lagos");
  const json = useMemo(() => {
    const lines = csv.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return "[]";
    const parse = (l: string) => l.match(/("([^"]|"")*"|[^,]*)(,|$)/g)?.map((c) => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')).filter((_, i, a) => i < a.length - 1 || a[i] !== "") ?? [];
    const head = parse(lines[0]);
    return JSON.stringify(lines.slice(1).map((l) => Object.fromEntries(parse(l).map((v, i) => [head[i] ?? `col${i}`, isNaN(Number(v)) || v === "" ? v : Number(v)]))), null, 2);
  }, [csv]);
  return (
    <div className="space-y-4">
      <Row>
        <Field label="CSV">
          <TextArea value={csv} onChange={setCsv} rows={10} />
        </Field>
        <Field label="JSON">
          <TextArea value={json} readOnly rows={10} />
        </Field>
      </Row>
      <CopyButton text={json} label="Copy JSON" />
    </div>
  );
}
