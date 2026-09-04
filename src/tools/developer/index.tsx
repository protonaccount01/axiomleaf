/**
 * DEVELOPER TOOLS – JSON, Base64, URL encoding, regex, UUID, JWT, hashing…
 * Uses only Web APIs (TextEncoder, crypto.subtle, crypto.randomUUID).
 */
import { useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";
import { Actions, CopyButton, ErrorText, Field, Input, Result, Row, Select, TextArea, downloadText } from "../shared/ToolUI";

/* ─── JSON Formatter / Validator ─── */
export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState("2");
  const { out, error } = useMemo(() => {
    if (!input.trim()) return { out: "", error: "" };
    try {
      const parsed = JSON.parse(input);
      return { out: JSON.stringify(parsed, null, indent === "min" ? 0 : Number(indent)), error: "" };
    } catch (e) {
      return { out: "", error: (e as Error).message };
    }
  }, [input, indent]);
  return (
    <div className="space-y-4">
      <Actions>
        <Select
          value={indent}
          onChange={setIndent}
          aria-label="Indentation"
          className="!w-auto"
          options={[
            { value: "2", label: "2 spaces" },
            { value: "4", label: "4 spaces" },
            { value: "min", label: "Minified" },
          ]}
        />
        <CopyButton text={out} />
        <button type="button" className="btn-ghost !py-1.5 !px-3 text-xs" disabled={!out} onClick={() => downloadText("data.json", out, "application/json")}>
          Download
        </button>
        {!error && out && <span className="badge">Valid JSON ✓</span>}
      </Actions>
      {error && <ErrorText>{error}</ErrorText>}
      <Row>
        <TextArea value={input} onChange={setInput} placeholder='{"paste": "json here"}' aria-label="JSON input" rows={14} />
        <TextArea value={out} readOnly aria-label="Formatted JSON" rows={14} />
      </Row>
    </div>
  );
}

/* ─── Base64 ─── */
const utf8ToB64 = (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const b64ToUtf8 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { out, error } = useMemo(() => {
    try {
      return { out: mode === "encode" ? utf8ToB64(input) : b64ToUtf8(input), error: "" };
    } catch {
      return { out: "", error: "Invalid Base64 input." };
    }
  }, [input, mode]);
  return (
    <div className="space-y-4">
      <Actions>
        <button type="button" className={mode === "encode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("encode")}>Encode</button>
        <button type="button" className={mode === "decode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("decode")}>Decode</button>
        <CopyButton text={out} />
      </Actions>
      {error && input && <ErrorText>{error}</ErrorText>}
      <Row>
        <TextArea value={input} onChange={setInput} placeholder={mode === "encode" ? "Plain text…" : "Base64 string…"} aria-label="Input" />
        <TextArea value={out} readOnly aria-label="Output" />
      </Row>
    </div>
  );
}

/* ─── URL Encoder / Decoder ─── */
export function UrlEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { out, error } = useMemo(() => {
    try {
      return { out: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input), error: "" };
    } catch {
      return { out: "", error: "Malformed URI sequence." };
    }
  }, [input, mode]);
  return (
    <div className="space-y-4">
      <Actions>
        <button type="button" className={mode === "encode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("encode")}>Encode</button>
        <button type="button" className={mode === "decode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("decode")}>Decode</button>
        <CopyButton text={out} />
      </Actions>
      {error && input && <ErrorText>{error}</ErrorText>}
      <Row>
        <TextArea value={input} onChange={setInput} placeholder="https://example.com/?q=hello world" aria-label="Input" rows={6} />
        <TextArea value={out} readOnly aria-label="Output" rows={6} />
      </Row>
    </div>
  );
}

/* ─── HTML Entity Encoder ─── */
export function HtmlEntities() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const out = useMemo(() => {
    if (mode === "encode")
      return input.replace(/[&<>"'`]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" })[c] ?? c);
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent ?? "";
  }, [input, mode]);
  return (
    <div className="space-y-4">
      <Actions>
        <button type="button" className={mode === "encode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("encode")}>Encode</button>
        <button type="button" className={mode === "decode" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("decode")}>Decode</button>
        <CopyButton text={out} />
      </Actions>
      <Row>
        <TextArea value={input} onChange={setInput} placeholder='<div class="a">Tom & Jerry</div>' aria-label="Input" rows={6} />
        <TextArea value={out} readOnly aria-label="Output" rows={6} />
      </Row>
    </div>
  );
}

/* ─── Regex Tester ─── */
export function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact: alice@example.com, bob@test.org");
  const { matches, error, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], error: "", highlighted: text };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches = [...text.matchAll(re)].map((m) => ({ text: m[0], index: m.index ?? 0, groups: m.slice(1) }));
      const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
      let last = 0;
      let html = "";
      for (const m of matches) {
        html += esc(text.slice(last, m.index)) + `<mark class="bg-leaf-200 rounded px-0.5">${esc(m.text)}</mark>`;
        last = m.index + m.text.length;
        if (!m.text.length) break;
      }
      html += esc(text.slice(last));
      return { matches, error: "", highlighted: html };
    } catch (e) {
      return { matches: [], error: (e as Error).message, highlighted: text };
    }
  }, [pattern, flags, text]);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <Field label="Pattern">
          <Input value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
        </Field>
        <Field label="Flags">
          <Input value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))} className="font-mono" />
        </Field>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      <TextArea value={text} onChange={setText} aria-label="Test string" rows={5} />
      <div className="rounded-xl border border-ink/10 bg-white p-4 font-mono text-sm whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(highlighted) }} />
      <p className="text-sm text-ink/60">
        <span className="badge">{matches.length} match{matches.length === 1 ? "" : "es"}</span>
      </p>
      {matches.length > 0 && (
        <ol className="max-h-56 space-y-1 overflow-auto text-sm">
          {matches.slice(0, 100).map((m, i) => (
            <li key={i} className="flex gap-3 font-mono">
              <span className="text-ink/40">{i + 1}.</span>
              <span className="text-leaf-800">{m.text}</span>
              <span className="text-ink/40">@{m.index}</span>
              {m.groups.length > 0 && <span className="text-ink/60">groups: {JSON.stringify(m.groups)}</span>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ─── UUID Generator ─── */
export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [list, setList] = useState<string[]>([]);
  const gen = () => setList(Array.from({ length: count }, () => crypto.randomUUID()));
  useEffect(gen, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="space-y-4">
      <Actions>
        <Input type="number" min={1} max={500} value={count} onChange={(e) => setCount(Math.max(1, Math.min(500, +e.target.value)))} className="!w-28" aria-label="Count" />
        <button type="button" className="btn-primary" onClick={gen}>Generate</button>
        <CopyButton text={list.join("\n")} label="Copy all" />
      </Actions>
      <TextArea value={list.join("\n")} readOnly aria-label="UUIDs" rows={8} />
    </div>
  );
}

/* ─── JWT Decoder ─── */
export function JwtDecoder() {
  const [token, setToken] = useState("");
  const { header, payload, error } = useMemo(() => {
    if (!token.trim()) return { header: "", payload: "", error: "" };
    try {
      const [h, p] = token.trim().split(".");
      const dec = (s: string) => JSON.stringify(JSON.parse(b64ToUtf8(s.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      return { header: dec(h), payload: dec(p), error: "" };
    } catch {
      return { header: "", payload: "", error: "Not a valid JWT." };
    }
  }, [token]);
  return (
    <div className="space-y-4">
      <TextArea value={token} onChange={setToken} placeholder="eyJhbGciOi…" aria-label="JWT" rows={4} />
      {error && <ErrorText>{error}</ErrorText>}
      <Row>
        <Field label="Header">
          <TextArea value={header} readOnly rows={6} />
        </Field>
        <Field label="Payload">
          <TextArea value={payload} readOnly rows={6} />
        </Field>
      </Row>
      <p className="text-xs text-ink/50">Decoding happens locally; the signature is not verified and nothing leaves your browser.</p>
    </div>
  );
}

/* ─── Hash Generator ─── */
export function HashGenerator() {
  const [text, setText] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = new TextEncoder().encode(text);
      const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
      const out: Record<string, string> = {};
      for (const a of algos) {
        const buf = await crypto.subtle.digest(a, data);
        out[a] = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
      }
      if (!cancelled) setHashes(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [text]);
  return (
    <div className="space-y-4">
      <TextArea value={text} onChange={setText} placeholder="Text to hash…" aria-label="Input" rows={5} />
      <div className="space-y-3">
        {Object.entries(hashes).map(([k, v]) => (
          <div key={k} className="flex items-start gap-3">
            <div className="flex-1">
              <Result label={k} value={v} />
            </div>
            <CopyButton text={v} className="mt-5" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Markdown Previewer (tiny built-in parser, sanitized) ─── */
function miniMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  const lines = md.split("\n");
  let html = "";
  let inCode = false;
  let list: "ul" | "ol" | null = null;
  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const line of lines) {
    if (line.startsWith("```")) { closeList(); html += inCode ? "</code></pre>" : "<pre><code>"; inCode = !inCode; continue; }
    if (inCode) { html += esc(line) + "\n"; continue; }
    const h = /^(#{1,6})\s+(.*)/.exec(line);
    if (h) { closeList(); html += `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`; continue; }
    if (/^\s*[-*]\s+/.test(line)) { if (list !== "ul") { closeList(); html += "<ul>"; list = "ul"; } html += `<li>${inline(line.replace(/^\s*[-*]\s+/, ""))}</li>`; continue; }
    if (/^\s*\d+\.\s+/.test(line)) { if (list !== "ol") { closeList(); html += "<ol>"; list = "ol"; } html += `<li>${inline(line.replace(/^\s*\d+\.\s+/, ""))}</li>`; continue; }
    if (/^>\s?/.test(line)) { closeList(); html += `<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`; continue; }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { closeList(); html += "<hr>"; continue; }
    if (!line.trim()) { closeList(); continue; }
    closeList();
    html += `<p>${inline(line)}</p>`;
  }
  closeList();
  if (inCode) html += "</code></pre>";
  return html;
}
export function MarkdownPreview() {
  const [md, setMd] = useState("# Hello Axiomleaf\n\nWrite **Markdown** on the left, see *HTML* on the right.\n\n- Lists\n- `inline code`\n\n```\nconst x = 42;\n```");
  const html = useMemo(() => DOMPurify.sanitize(miniMarkdown(md)), [md]);
  return (
    <div className="space-y-4">
      <Row>
        <TextArea value={md} onChange={setMd} aria-label="Markdown" rows={16} />
        <div className="prose-ax min-h-40 rounded-xl border border-ink/10 bg-white p-4" dangerouslySetInnerHTML={{ __html: html }} />
      </Row>
      <CopyButton text={html} label="Copy HTML" />
    </div>
  );
}

/* ─── CSS Minifier / Beautifier ─── */
export function CssMinifier() {
  const [css, setCss] = useState("");
  const [mode, setMode] = useState<"minify" | "beautify">("minify");
  const out = useMemo(() => {
    if (mode === "minify")
      return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
    return css
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n\n")
      .replace(/\n  \n}/g, "\n}")
      .trim();
  }, [css, mode]);
  return (
    <div className="space-y-4">
      <Actions>
        <button type="button" className={mode === "minify" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("minify")}>Minify</button>
        <button type="button" className={mode === "beautify" ? "btn-primary !py-1.5" : "btn-ghost !py-1.5"} onClick={() => setMode("beautify")}>Beautify</button>
        <CopyButton text={out} />
        {css && <span className="badge">{css.length} → {out.length} bytes</span>}
      </Actions>
      <Row>
        <TextArea value={css} onChange={setCss} placeholder=".a { color: red; }" aria-label="CSS input" rows={12} />
        <TextArea value={out} readOnly aria-label="Output" rows={12} />
      </Row>
    </div>
  );
}
