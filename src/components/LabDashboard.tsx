"use client";

import { useMemo, useState } from "react";
import { parseHl7Action, parseX12Action } from "@/app/actions";
import { debugScenarios } from "@/lib/debugScenarios";
import { loopMappings } from "@/lib/mapping";
import { sampleHl7Message, sampleX12Payload } from "@/lib/samples";
import type { ParsedHl7, ParsedX12 } from "@/lib/types";
import { JsonBlock } from "./JsonBlock";
import { SectionCard } from "./SectionCard";

const tabs = ["HL7 Parser", "X12 278 Parser", "Mapping View", "Validation Results", "Debug Log"] as const;
type Tab = (typeof tabs)[number];

export function LabDashboard({ initialHl7, initialX12 }: { initialHl7: ParsedHl7; initialX12: ParsedX12 }) {
  const [activeTab, setActiveTab] = useState<Tab>("HL7 Parser");
  const [hl7Raw, setHl7Raw] = useState(sampleHl7Message);
  const [x12Raw, setX12Raw] = useState(sampleX12Payload);
  const [hl7Parsed, setHl7Parsed] = useState(initialHl7);
  const [x12Parsed, setX12Parsed] = useState(initialX12);
  const [log, setLog] = useState<string[]>(["Loaded educational HL7 and X12 278 samples."]);

  const currentNormalized = activeTab === "HL7 Parser" ? hl7Parsed.normalized : x12Parsed.normalized;
  const validationItems = useMemo(
    () => [
      { label: "HL7 sample", payload: hl7Parsed.normalized },
      { label: "X12 278 sample", payload: x12Parsed.normalized },
      ...debugScenarios.map((scenario) => ({ label: scenario.title, payload: scenario.parsed })),
    ],
    [hl7Parsed, x12Parsed],
  );

  async function parseHl7() {
    const parsed = await parseHl7Action(hl7Raw);
    setHl7Parsed(parsed);
    setLog((items) => [`Parsed HL7 message ${parsed.normalized.metadata.messageControlId ?? "without control ID"}.`, ...items]);
  }

  async function parseX12() {
    const parsed = await parseX12Action(x12Raw);
    setX12Parsed(parsed);
    setLog((items) => [`Parsed X12 transaction ${parsed.normalized.metadata.transactionId ?? "without transaction ID"}.`, ...items]);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-indigo-700 to-slate-950 p-8 text-white shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-200">Interview-prep sandbox</p>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Prior Auth Integration Lab</h1>
        <p className="mt-5 max-w-4xl text-lg text-indigo-100">
          Learn how HL7 v2 pipe-delimited clinical messages and X12 278 EDI service-review transactions can be parsed,
          validated, debugged, and mapped into one normalized prior-authorization API payload.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => { setHl7Raw(sampleHl7Message); setActiveTab("HL7 Parser"); }} className="rounded-full bg-white px-5 py-3 font-semibold text-indigo-700 shadow-sm">
            Load HL7 sample
          </button>
          <button onClick={() => { setX12Raw(sampleX12Payload); setActiveTab("X12 278 Parser"); }} className="rounded-full bg-indigo-100 px-5 py-3 font-semibold text-indigo-900 shadow-sm">
            Load X12 278 sample
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["HL7 v2", "Segmented clinical messaging used by EHRs for ADT, orders, results, and operational events."],
          ["X12 278", "EDI transaction family for health care services review / prior authorization workflows."],
          ["Normalized model", "A stable internal API shape that lets integration logic decouple from source-specific formats."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab ? "bg-humata text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "HL7 Parser" && (
        <ParserPanel raw={hl7Raw} setRaw={setHl7Raw} parse={parseHl7} parsed={hl7Parsed} title="HL7 v2 ADT-like parser" />
      )}
      {activeTab === "X12 278 Parser" && (
        <ParserPanel raw={x12Raw} setRaw={setX12Raw} parse={parseX12} parsed={x12Parsed} title="Simplified X12 278 parser" />
      )}
      {activeTab === "Mapping View" && (
        <SectionCard title="278 loop learning mode" eyebrow="Educational mapping">
          <p className="mb-5 text-slate-600">Loop usage varies by implementation guide and payer companion guide; this view shows common concepts and one possible internal API mapping.</p>
          <div className="grid gap-4 lg:grid-cols-3">
            {loopMappings.map((mapping) => (
              <div key={mapping.loop} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-humata">Loop {mapping.loop}</p>
                <h3 className="mt-1 font-bold text-ink">{mapping.concept}</h3>
                <p className="mt-3 text-sm text-slate-600"><strong>Source:</strong> {mapping.sourceExample}</p>
                <p className="mt-2 text-sm text-slate-600"><strong>Internal path:</strong> {mapping.internalPath}</p>
                <p className="mt-2 text-xs text-slate-500">{mapping.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6"><JsonBlock value={currentNormalized} /></div>
        </SectionCard>
      )}
      {activeTab === "Validation Results" && (
        <SectionCard title="Validation engine results" eyebrow="Errors vs warnings">
          <div className="grid gap-4 lg:grid-cols-2">
            {validationItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 p-4">
                <h3 className="font-bold text-ink">{item.label}</h3>
                <p className="mt-3 text-sm font-semibold text-red-700">Errors</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                  {item.payload.metadata.validationErrors.length ? item.payload.metadata.validationErrors.map((error) => <li key={error}>{error}</li>) : <li>No blocking errors.</li>}
                </ul>
                <p className="mt-3 text-sm font-semibold text-amber-700">Warnings</p>
                <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                  {item.payload.metadata.warnings.length ? item.payload.metadata.warnings.map((warning) => <li key={warning}>{warning}</li>) : <li>No warnings.</li>}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
      {activeTab === "Debug Log" && (
        <SectionCard title="Simulated integration failure cases" eyebrow="Debugging mode">
          <div className="space-y-5">
            {debugScenarios.map((scenario) => (
              <details key={scenario.title} className="rounded-2xl border border-slate-200 p-4" open>
                <summary className="cursor-pointer font-bold text-ink">{scenario.title}</summary>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <pre className="rounded-xl bg-slate-100 p-3 text-xs text-slate-800">{scenario.rawPayload}</pre>
                  <JsonBlock value={scenario.parsed} />
                </div>
                <h4 className="mt-4 font-semibold text-red-700">Validation error</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700">{scenario.parsed.metadata.validationErrors.map((error) => <li key={error}>{error}</li>)}</ul>
                <h4 className="mt-4 font-semibold text-ink">Suggested debugging steps</h4>
                <ol className="list-decimal pl-5 text-sm text-slate-700">{scenario.suggestedSteps.map((step) => <li key={step}>{step}</li>)}</ol>
                <p className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-950"><strong>Customer-facing explanation:</strong> {scenario.customerExplanation}</p>
              </details>
            ))}
            <div className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{log.map((item) => <p key={item}>• {item}</p>)}</div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function ParserPanel({ raw, setRaw, parse, parsed, title }: { raw: string; setRaw: (raw: string) => void; parse: () => void; parsed: ParsedHl7 | ParsedX12; title: string }) {
  const segmentData = "segments" in parsed ? parsed.segments : [];
  return (
    <SectionCard title={title} eyebrow="Hands-on parsing">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Raw message</label>
          <textarea value={raw} onChange={(event) => setRaw(event.target.value)} className="h-80 w-full rounded-2xl border border-slate-300 p-4 font-mono text-sm shadow-sm" />
          <button onClick={parse} className="mt-3 rounded-full bg-humata px-5 py-3 text-sm font-bold text-white shadow-sm">Parse message</button>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Parsed segment tree</p>
          <JsonBlock value={segmentData} />
        </div>
      </div>
      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-slate-700">Normalized prior-auth JSON</p>
        <JsonBlock value={parsed.normalized} />
      </div>
    </SectionCard>
  );
}
