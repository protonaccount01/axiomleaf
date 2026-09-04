/**
 * CALCULATORS – percentage, BMI, age, EMI, tips, dates, discounts…
 */
import { useMemo, useState } from "react";
import { Field, Input, Result, Row, Select } from "../shared/ToolUI";

const num = (v: string) => (v.trim() === "" ? NaN : Number(v));
const fmt = (n: number, d = 2) => (isNaN(n) || !isFinite(n) ? "—" : Number(n.toFixed(d)).toLocaleString());

/* ─── Percentage Calculator ─── */
export function PercentageCalculator() {
  const [a, setA] = useState("15");
  const [b, setB] = useState("200");
  const [c, setC] = useState("50");
  const [d, setD] = useState("200");
  const [e, setE] = useState("80");
  const [f, setF] = useState("100");
  return (
    <div className="space-y-6">
      <div className="card p-5">
        <p className="mb-3 text-sm font-medium">What is <b>X%</b> of <b>Y</b>?</p>
        <Row className="sm:grid-cols-3">
          <Input type="number" value={a} onChange={(ev) => setA(ev.target.value)} aria-label="Percent" />
          <Input type="number" value={b} onChange={(ev) => setB(ev.target.value)} aria-label="Of value" />
          <Result label="Result" value={fmt((num(a) / 100) * num(b))} />
        </Row>
      </div>
      <div className="card p-5">
        <p className="mb-3 text-sm font-medium"><b>X</b> is what percent of <b>Y</b>?</p>
        <Row className="sm:grid-cols-3">
          <Input type="number" value={c} onChange={(ev) => setC(ev.target.value)} aria-label="Part" />
          <Input type="number" value={d} onChange={(ev) => setD(ev.target.value)} aria-label="Whole" />
          <Result label="Result" value={fmt((num(c) / num(d)) * 100) + "%"} />
        </Row>
      </div>
      <div className="card p-5">
        <p className="mb-3 text-sm font-medium">Percentage change from <b>X</b> to <b>Y</b></p>
        <Row className="sm:grid-cols-3">
          <Input type="number" value={e} onChange={(ev) => setE(ev.target.value)} aria-label="From" />
          <Input type="number" value={f} onChange={(ev) => setF(ev.target.value)} aria-label="To" />
          <Result label="Change" value={fmt(((num(f) - num(e)) / num(e)) * 100) + "%"} />
        </Row>
      </div>
    </div>
  );
}

/* ─── BMI Calculator ─── */
export function BmiCalculator() {
  const [unit, setUnit] = useState("metric");
  const [h, setH] = useState("175");
  const [w, setW] = useState("70");
  const bmi = useMemo(() => {
    let hm = num(h), kg = num(w);
    if (unit === "imperial") { hm = hm * 0.0254; kg = kg * 0.45359237; } else hm /= 100;
    return kg / (hm * hm);
  }, [h, w, unit]);
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));
  return (
    <div className="space-y-4">
      <Select value={unit} onChange={setUnit} aria-label="Units" options={[{ value: "metric", label: "Metric (cm, kg)" }, { value: "imperial", label: "Imperial (in, lb)" }]} />
      <Row>
        <Field label={unit === "metric" ? "Height (cm)" : "Height (inches)"}><Input type="number" value={h} onChange={(e) => setH(e.target.value)} /></Field>
        <Field label={unit === "metric" ? "Weight (kg)" : "Weight (lb)"}><Input type="number" value={w} onChange={(e) => setW(e.target.value)} /></Field>
      </Row>
      {isFinite(bmi) && bmi > 0 && (
        <div className="card p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-extrabold text-leaf-700">{bmi.toFixed(1)}</span>
            <span className="badge">{cat}</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-leaf-500 via-40% to-red-500">
            <div className="relative h-2" style={{ left: `${pct}%` }}><span className="absolute -top-1 h-4 w-1 rounded bg-ink" /></div>
          </div>
          <p className="mt-3 text-xs text-ink/55">BMI is a screening measure and does not diagnose body fatness or health. Consult a professional for medical advice.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Age Calculator ─── */
export function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [at, setAt] = useState(new Date().toISOString().slice(0, 10));
  const r = useMemo(() => {
    const b = new Date(dob), t = new Date(at);
    if (isNaN(b.getTime()) || isNaN(t.getTime()) || t < b) return null;
    let y = t.getFullYear() - b.getFullYear(), m = t.getMonth() - b.getMonth(), d = t.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((t.getTime() - b.getTime()) / 86400000);
    const next = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (next < t) next.setFullYear(next.getFullYear() + 1);
    return { y, m, d, days, weeks: Math.floor(days / 7), hours: days * 24, nextBday: Math.ceil((next.getTime() - t.getTime()) / 86400000) };
  }, [dob, at]);
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Date of birth"><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
        <Field label="Age at date"><Input type="date" value={at} onChange={(e) => setAt(e.target.value)} /></Field>
      </Row>
      {r && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Result label="Age" value={`${r.y} years, ${r.m} months, ${r.d} days`} mono={false} large />
          <Result label="Total days" value={r.days.toLocaleString()} />
          <Result label="Total weeks" value={r.weeks.toLocaleString()} />
          <Result label="Total hours" value={r.hours.toLocaleString()} />
          <Result label="Next birthday in" value={`${r.nextBday} days`} />
        </div>
      )}
    </div>
  );
}

/* ─── Loan / EMI Calculator ─── */
export function LoanCalculator() {
  const [p, setP] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("30");
  const r = useMemo(() => {
    const P = num(p), i = num(rate) / 100 / 12, n = num(years) * 12;
    if (!(P > 0) || !(n > 0)) return null;
    const emi = i === 0 ? P / n : (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    return { emi, total: emi * n, interest: emi * n - P };
  }, [p, rate, years]);
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Loan amount"><Input type="number" value={p} onChange={(e) => setP(e.target.value)} /></Field>
        <Field label="Annual interest rate (%)"><Input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Term (years)"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
      </Row>
      {r && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Result label="Monthly payment" value={fmt(r.emi)} large />
          <Result label="Total interest" value={fmt(r.interest)} />
          <Result label="Total paid" value={fmt(r.total)} />
        </div>
      )}
    </div>
  );
}

/* ─── Tip Calculator ─── */
export function TipCalculator() {
  const [bill, setBill] = useState("64.50");
  const [tip, setTip] = useState(15);
  const [people, setPeople] = useState(2);
  const b = num(bill);
  const tipAmt = (b * tip) / 100;
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Bill amount"><Input type="number" step="0.01" value={bill} onChange={(e) => setBill(e.target.value)} /></Field>
        <Field label={`Tip: ${tip}%`}><input type="range" min={0} max={40} value={tip} onChange={(e) => setTip(+e.target.value)} className="mt-3 w-full accent-leaf-600" /></Field>
        <Field label="Split between"><Input type="number" min={1} value={people} onChange={(e) => setPeople(Math.max(1, +e.target.value))} /></Field>
      </Row>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="Tip" value={fmt(tipAmt)} />
        <Result label="Total" value={fmt(b + tipAmt)} />
        <Result label="Per person" value={fmt((b + tipAmt) / people)} large />
      </div>
    </div>
  );
}

/* ─── Date Difference ─── */
export function DateDifference() {
  const [a, setA] = useState(new Date().toISOString().slice(0, 10));
  const [b, setB] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const r = useMemo(() => {
    const d1 = new Date(a), d2 = new Date(b);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const ms = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.round(ms / 86400000);
    let biz = 0;
    const s = new Date(Math.min(d1.getTime(), d2.getTime()));
    for (let i = 0; i < days; i++) { const day = s.getDay(); if (day !== 0 && day !== 6) biz++; s.setDate(s.getDate() + 1); }
    return { days, weeks: (days / 7).toFixed(1), months: (days / 30.4375).toFixed(1), years: (days / 365.25).toFixed(2), biz };
  }, [a, b]);
  return (
    <div className="space-y-4">
      <Row>
        <Field label="Start date"><Input type="date" value={a} onChange={(e) => setA(e.target.value)} /></Field>
        <Field label="End date"><Input type="date" value={b} onChange={(e) => setB(e.target.value)} /></Field>
      </Row>
      {r && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Result label="Days" value={r.days} large />
          <Result label="Weeks" value={r.weeks} />
          <Result label="Months" value={r.months} />
          <Result label="Years" value={r.years} />
          <Result label="Business days" value={r.biz} />
        </div>
      )}
    </div>
  );
}

/* ─── Discount Calculator ─── */
export function DiscountCalculator() {
  const [price, setPrice] = useState("120");
  const [off, setOff] = useState("25");
  const [tax, setTax] = useState("0");
  const p = num(price), d = num(off), t = num(tax);
  const saved = (p * d) / 100;
  const after = p - saved;
  const final = after * (1 + (isNaN(t) ? 0 : t) / 100);
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Original price"><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Discount (%)"><Input type="number" value={off} onChange={(e) => setOff(e.target.value)} /></Field>
        <Field label="Sales tax (%)"><Input type="number" value={tax} onChange={(e) => setTax(e.target.value)} /></Field>
      </Row>
      <div className="grid gap-3 sm:grid-cols-3">
        <Result label="You save" value={fmt(saved)} />
        <Result label="Sale price" value={fmt(after)} />
        <Result label="Final (with tax)" value={fmt(final)} large />
      </div>
    </div>
  );
}

/* ─── Aspect Ratio Calculator ─── */
export function AspectRatio() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [newW, setNewW] = useState("1280");
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const W = num(w), H = num(h);
  const g = gcd(W, H) || 1;
  const ratio = W && H ? `${W / g}:${H / g}` : "—";
  const newH = W ? fmt((num(newW) * H) / W, 0) : "—";
  return (
    <div className="space-y-4">
      <Row className="sm:grid-cols-3">
        <Field label="Width"><Input type="number" value={w} onChange={(e) => setW(e.target.value)} /></Field>
        <Field label="Height"><Input type="number" value={h} onChange={(e) => setH(e.target.value)} /></Field>
        <Result label="Aspect ratio" value={ratio} large />
      </Row>
      <div className="card p-5">
        <p className="mb-3 text-sm font-medium">Scale to a new width, keeping the ratio</p>
        <Row>
          <Field label="New width"><Input type="number" value={newW} onChange={(e) => setNewW(e.target.value)} /></Field>
          <Result label="New height" value={newH} />
        </Row>
      </div>
    </div>
  );
}
