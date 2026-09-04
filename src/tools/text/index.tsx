/**
 * TEXT TOOLS – word counter, case converter, lorem ipsum, etc.
 * Every export is a self-contained React component with no props.
 */
import { useMemo, useState } from "react";
import { Actions, CopyButton, Field, Input, Row, Select, Stat, TextArea } from "../shared/ToolUI";

/* ─── Word Counter ─── */
export function WordCounter() {
  const [text, setText] = useState("");
  const s = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) ?? []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    return {
      words,
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, "").length,
      sentences,
      paragraphs,
      readingTime: Math.max(1, Math.ceil(words / 200)),
    };
  }, [text]);
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} placeholder="Type or paste your text here…" aria-label="Text input" rows={10} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={s.words} />
        <Stat label="Characters" value={s.chars} />
        <Stat label="No spaces" value={s.charsNoSpace} />
        <Stat label="Sentences" value={s.sentences} />
        <Stat label="Paragraphs" value={s.paragraphs} />
        <Stat label="Read time" value={text ? `${s.readingTime} min` : "0 min"} />
      </div>
    </div>
  );
}

/* ─── Case Converter ─── */
export function CaseConverter() {
  const [text, setText] = useState("");
  const toTitle = (t: string) => t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const toSentence = (t: string) => t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
  const toCamel = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^[^a-z]+/, "");
  const toSnake = (t: string) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const toKebab = (t: string) => t.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const alternating = (t: string) => [...t].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("");
  const ops: [string, (t: string) => string][] = [
    ["UPPERCASE", (t) => t.toUpperCase()],
    ["lowercase", (t) => t.toLowerCase()],
    ["Title Case", toTitle],
    ["Sentence case", toSentence],
    ["camelCase", toCamel],
    ["snake_case", toSnake],
    ["kebab-case", toKebab],
    ["aLtErNaTiNg", alternating],
  ];
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} placeholder="Enter text to convert…" aria-label="Text input" />
      <Actions>
        {ops.map(([label, fn]) => (
          <button key={label} type="button" className="btn-ghost !py-1.5 !px-3 text-xs" onClick={() => setText(fn(text))}>
            {label}
          </button>
        ))}
        <CopyButton text={text} />
        <button type="button" className="btn-ghost !py-1.5 !px-3 text-xs" onClick={() => setText("")}>
          Clear
        </button>
      </Actions>
    </div>
  );
}

/* ─── Lorem Ipsum Generator ─── */
const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );
export function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState("paragraphs");
  const [out, setOut] = useState("");
  const rnd = (n: number) => Math.floor(Math.random() * n);
  const sentence = () => {
    const len = 8 + rnd(10);
    const w = Array.from({ length: len }, () => LOREM[rnd(LOREM.length)]);
    w[0] = w[0][0].toUpperCase() + w[0].slice(1);
    return w.join(" ") + ".";
  };
  const gen = () => {
    if (unit === "words") setOut(Array.from({ length: count }, () => LOREM[rnd(LOREM.length)]).join(" "));
    else if (unit === "sentences") setOut(Array.from({ length: count }, sentence).join(" "));
    else
      setOut(
        Array.from({ length: count }, () => Array.from({ length: 4 + rnd(4) }, sentence).join(" ")).join("\n\n"),
      );
  };
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Amount">
          <Input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, +e.target.value)))} />
        </Field>
        <Field label="Unit">
          <Select
            value={unit}
            onChange={setUnit}
            options={[
              { value: "paragraphs", label: "Paragraphs" },
              { value: "sentences", label: "Sentences" },
              { value: "words", label: "Words" },
            ]}
          />
        </Field>
      </Row>
      <Actions>
        <button type="button" className="btn-primary" onClick={gen}>
          Generate
        </button>
        <CopyButton text={out} />
      </Actions>
      <TextArea value={out} readOnly rows={10} aria-label="Generated text" />
    </div>
  );
}

/* ─── Remove Duplicate Lines ─── */
export function DuplicateRemover() {
  const [text, setText] = useState("");
  const [caseSensitive, setCase] = useState(true);
  const [trim, setTrim] = useState(true);
  const result = useMemo(() => {
    const seen = new Set<string>();
    const lines = text.split("\n");
    const out: string[] = [];
    for (const raw of lines) {
      const line = trim ? raw.trim() : raw;
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(line);
      }
    }
    return { text: out.join("\n"), removed: lines.length - out.length };
  }, [text, caseSensitive, trim]);
  return (
    <div className="space-y-4">
      <Row>
        <TextArea value={text} onChange={setText} placeholder="One item per line…" aria-label="Input lines" />
        <TextArea value={result.text} readOnly aria-label="Deduplicated output" />
      </Row>
      <Actions>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCase(e.target.checked)} /> Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespace
        </label>
        <span className="badge">{result.removed} duplicates removed</span>
        <CopyButton text={result.text} />
      </Actions>
    </div>
  );
}

/* ─── Text Reverser ─── */
export function TextReverser() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("chars");
  const out = useMemo(() => {
    if (mode === "chars") return [...text].reverse().join("");
    if (mode === "words") return text.split(/(\s+)/).reverse().join("");
    return text.split("\n").reverse().join("\n");
  }, [text, mode]);
  return (
    <div className="space-y-4">
      <Select
        value={mode}
        onChange={setMode}
        aria-label="Reverse mode"
        options={[
          { value: "chars", label: "Reverse characters" },
          { value: "words", label: "Reverse word order" },
          { value: "lines", label: "Reverse line order" },
        ]}
      />
      <Row>
        <TextArea value={text} onChange={setText} placeholder="Input…" aria-label="Input" />
        <TextArea value={out} readOnly aria-label="Reversed output" />
      </Row>
      <CopyButton text={out} />
    </div>
  );
}

/* ─── Slug Generator ─── */
export function SlugGenerator() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState("-");
  const slug = useMemo(
    () =>
      text
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, sep)
        .replace(new RegExp(`^\\${sep}+|\\${sep}+$`, "g"), ""),
    [text, sep],
  );
  return (
    <div className="space-y-4">
      <Field label="Title or phrase">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="How to Build a Fast Website in 2025" />
      </Field>
      <Select
        value={sep}
        onChange={setSep}
        aria-label="Separator"
        options={[
          { value: "-", label: "Hyphen (-)" },
          { value: "_", label: "Underscore (_)" },
        ]}
      />
      <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-leaf-50/50 px-4 py-3 font-mono text-sm break-all">
        <span className="flex-1">{slug || <span className="text-ink/40">your-slug-appears-here</span>}</span>
        <CopyButton text={slug} />
      </div>
    </div>
  );
}

/* ─── Find & Replace ─── */
export function FindReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setRegex] = useState(false);
  const [ci, setCi] = useState(false);
  const { out, count, error } = useMemo(() => {
    if (!find) return { out: text, count: 0, error: "" };
    try {
      const re = new RegExp(useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ci ? "gi" : "g");
      const count = (text.match(re) ?? []).length;
      return { out: text.replace(re, replace), count, error: "" };
    } catch (e) {
      return { out: text, count: 0, error: (e as Error).message };
    }
  }, [text, find, replace, useRegex, ci]);
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Find">
          <Input value={find} onChange={(e) => setFind(e.target.value)} />
        </Field>
        <Field label="Replace with">
          <Input value={replace} onChange={(e) => setReplace(e.target.value)} />
        </Field>
      </Row>
      <Actions>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useRegex} onChange={(e) => setRegex(e.target.checked)} /> Regex
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Ignore case
        </label>
        <span className="badge">{count} matches</span>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </Actions>
      <Row>
        <TextArea value={text} onChange={setText} placeholder="Source text…" aria-label="Source" />
        <TextArea value={out} readOnly aria-label="Result" />
      </Row>
      <CopyButton text={out} />
    </div>
  );
}

/* ─── Word Frequency Counter ─── */
export function WordFrequency() {
  const [text, setText] = useState("");
  const rows = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []) m.set(w, (m.get(w) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
  }, [text]);
  const total = rows.reduce((a, [, n]) => a + n, 0);
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} placeholder="Paste text to analyse…" aria-label="Input" />
      {rows.length > 0 && (
        <div className="max-h-80 overflow-auto rounded-xl border border-ink/10">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-leaf-50 text-left text-xs uppercase text-ink/60">
              <tr>
                <th className="px-3 py-2">Word</th>
                <th className="px-3 py-2">Count</th>
                <th className="px-3 py-2">%</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([w, n]) => (
                <tr key={w} className="border-t border-ink/5">
                  <td className="px-3 py-1.5 font-mono">{w}</td>
                  <td className="px-3 py-1.5">{n}</td>
                  <td className="px-3 py-1.5">{((n / total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Text Sorter ─── */
export function TextSorter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("az");
  const out = useMemo(() => {
    const lines = text.split("\n").filter((l) => l.length);
    const c = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    if (mode === "az") lines.sort(c.compare);
    if (mode === "za") lines.sort((a, b) => c.compare(b, a));
    if (mode === "len") lines.sort((a, b) => a.length - b.length);
    if (mode === "shuffle") for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; }
    return lines.join("\n");
  }, [text, mode]);
  return (
    <div className="space-y-4">
      <Select
        value={mode}
        onChange={setMode}
        aria-label="Sort mode"
        options={[
          { value: "az", label: "A → Z (natural)" },
          { value: "za", label: "Z → A" },
          { value: "len", label: "By length" },
          { value: "shuffle", label: "Shuffle randomly" },
        ]}
      />
      <Row>
        <TextArea value={text} onChange={setText} placeholder="One item per line…" aria-label="Input" />
        <TextArea value={out} readOnly aria-label="Sorted output" />
      </Row>
      <CopyButton text={out} />
    </div>
  );
}
