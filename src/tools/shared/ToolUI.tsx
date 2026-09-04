/**
 * Building blocks shared by every tool component.
 * Keeping tools consistent = less code and a cleaner UX.
 */
import { useState, type ReactNode, type ChangeEvent } from "react";
import { cn } from "@/utils/cn";

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 8,
  readOnly,
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <textarea
      className={cn("textarea", readOnly && "bg-ink/[0.03]", className)}
      value={value}
      rows={rows}
      readOnly={readOnly}
      placeholder={placeholder}
      aria-label={ariaLabel}
      spellCheck={false}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input", props.className)} />;
}

export function Select({
  value,
  onChange,
  options,
  className,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <select
      className={cn("input", className)}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable (insecure context) */
    }
  };
  return (
    <button type="button" onClick={copy} disabled={!text} className={cn("btn-ghost !py-1.5 !px-3 text-xs", className)}>
      {copied ? "✓ Copied" : label}
    </button>
  );
}

export function Result({
  label,
  value,
  mono = true,
  large,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
  large?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-leaf-50/50 px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-wider text-ink/50">{label}</div>
      <div
        className={cn(
          "mt-1 break-all text-ink",
          mono && "font-mono",
          large ? "text-2xl font-bold" : "text-sm font-semibold",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-4 text-center">
      <div className="text-2xl font-bold text-leaf-700">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-ink/55">{label}</div>
    </div>
  );
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p>;
}

/** Small helper to download a string as a file – used by several tools. */
export function downloadText(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
