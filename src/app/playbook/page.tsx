import { JsonBlock } from "@/components/JsonBlock";
import { SectionCard } from "@/components/SectionCard";
import {
  attachment275Workflow,
  integrationArtifacts,
  packetTracingCommands,
  postmanCollectionExample,
  securityChecklist,
  sqlAuditSnippets,
  standardizedErrorExample,
} from "@/lib/integrationPlaybook";

export default function PlaybookPage() {
  return (
    <div className="space-y-6">
      <SectionCard title="Humata-style integration playbook" eyebrow="Role-specific enablement">
        <p className="text-slate-600">
          A customer-facing Solutions Engineer needs to connect payload mapping, secure transport, validation, monitoring,
          automation, and clear communication. This page turns the job description into concrete artifacts you can discuss.
        </p>
      </SectionCard>

      <section className="grid gap-4 lg:grid-cols-2">
        {integrationArtifacts.map((artifact) => (
          <article key={artifact.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-humata">{artifact.jobSignal}</p>
            <h2 className="mt-2 text-xl font-bold text-ink">{artifact.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700"><strong>How to explain it:</strong> {artifact.howToTalkAboutIt}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700"><strong>Lab tie-in:</strong> {artifact.labExample}</p>
            <p className="mt-2 rounded-2xl bg-indigo-50 p-3 text-sm text-indigo-950"><strong>Discovery question:</strong> {artifact.customerQuestion}</p>
          </article>
        ))}
      </section>

      <SectionCard title="275 attachment workflow" eyebrow="Clinical documentation exchange">
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
          {attachment275Workflow.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </SectionCard>

      <SectionCard title="VPN, mTLS, certificates, and PHI security checklist" eyebrow="Customer IT discovery">
        <ul className="grid gap-3 md:grid-cols-2">
          {securityChecklist.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Standardized error envelope" eyebrow="Error handling framework">
        <p className="mb-3 text-sm text-slate-600">
          Use a consistent shape across EDI, API, SFTP, and connectivity failures so support teams can separate retryable
          transport issues from non-retryable data-quality issues.
        </p>
        <JsonBlock value={standardizedErrorExample} />
      </SectionCard>

      <SectionCard title="SQL audit patterns" eyebrow="Migration validation and RCA">
        <div className="space-y-4">
          {sqlAuditSnippets.map((snippet) => (
            <div key={snippet.title}>
              <h3 className="mb-2 font-bold text-ink">{snippet.title}</h3>
              <pre className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{snippet.sql}</pre>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Packet tracing and certificate diagnostics" eyebrow="Connectivity debugging">
        <div className="grid gap-4 lg:grid-cols-3">
          {packetTracingCommands.map((command) => (
            <div key={command.title} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-bold text-ink">{command.title}</h3>
              <pre className="mt-3 rounded-xl bg-slate-950 p-3 text-xs text-slate-100">{command.command}</pre>
              <p className="mt-3 text-sm text-slate-600">{command.note}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Postman/Newman smoke-test collection skeleton" eyebrow="Automation">
        <p className="mb-3 text-sm text-slate-600">
          Export this shape into a collection file and run it with a command such as
          <code className="mx-1 rounded bg-slate-100 px-1 py-0.5">newman run collection.json --env-var baseUrl=http://localhost:3000</code>.
        </p>
        <JsonBlock value={postmanCollectionExample} />
      </SectionCard>
    </div>
  );
}
