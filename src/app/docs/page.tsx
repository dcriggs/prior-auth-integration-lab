import { SectionCard } from "@/components/SectionCard";
import type { PriorAuthRequest } from "@/lib/types";

const checklist = [
  "Source system and owning analyst/team",
  "Transport method: SFTP, VPN, HTTPS API, MLLP, clearinghouse, or portal export",
  "Auth method: mutual TLS, OAuth, API key, VPN allowlist, or trading-partner credentials",
  "Message format and version: HL7 v2.x, X12 278 guide, FHIR, CSV, or custom JSON",
  "Required fields and conditional requirements",
  "Error handling ownership and escalation path",
  "Retry logic, replay windows, and idempotency keys",
  "Monitoring/alerting expectations and business-hours coverage",
  "Positive, negative, edge-case, and payer-specific test cases",
];

const authFlowChecklist = [
  "OAuth2 client credentials: token URL, scopes, audience, expiration, and refresh strategy",
  "API keys: header name, rotation cadence, environment separation, and emergency revocation process",
  "mTLS: client certificate owner, CA chain, SAN/CN expectations, expiration monitoring, and renewal runbook",
  "SFTP: SSH key type, passphrase handling, folder ACLs, file retention, and PGP/encryption expectations",
];

const monitoringSignals = [
  "278R request volume by payer and source system",
  "Schema validation failures and top missing-field categories",
  "Average payer response time and timeout rate",
  "SFTP file pickup/acknowledgement latency",
  "275 attachment rejection or orphaned-document count",
  "Certificate expiration and VPN tunnel health",
];

const schemaExample: PriorAuthRequest = {
  sourceType: "X12_278",
  patient: {
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1985-07-14",
    sex: "F",
    memberId: "MEM987654",
    mrn: "MRN12345",
  },
  payer: { name: "ACME HEALTH PLAN", payerId: "PAY123" },
  provider: { name: "GOODHEALTH CLINIC", npi: "1234567893" },
  request: {
    requestType: "Admission/service authorization request",
    serviceDate: "2026-05-15",
    diagnosisCodes: ["I10"],
    procedureCodes: ["73721"],
    status: "Ready for payer submission",
  },
  metadata: {
    transactionId: "PA-2026-0001",
    receivedAt: "2026-05-07T12:30:00.000Z",
    validationErrors: [],
    warnings: [],
  },
};

export default function DocumentationPage() {
  return (
    <div className="space-y-6">
      <SectionCard title="Integration architecture documentation" eyebrow="Reference notes">
        <p className="text-slate-600">
          These lightweight diagrams and checklists are meant to help structure interview conversations about workflow,
          transport, payload mapping, validation, operational support, and payer-specific edge cases.
        </p>
      </SectionCard>

      <SectionCard title="Sequence diagram" eyebrow="Mermaid syntax">
        <pre className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{`sequenceDiagram
  participant EHR
  participant Integration as Integration Layer
  participant Platform as Humata-like Platform
  participant Payer
  EHR->>Integration: HL7 v2 ADT / API event / file drop
  Integration->>Integration: Parse, validate, map, enrich
  Integration->>Platform: Normalized prior-auth payload
  Platform->>Payer: X12 278 / API / portal workflow
  Payer-->>Platform: Status, rejection, or request for info
  Platform-->>Integration: Normalized response + audit log
  Integration-->>EHR: Update status or workqueue`}</pre>
      </SectionCard>

      <SectionCard title="Data flow diagram" eyebrow="Mermaid syntax">
        <pre className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{`flowchart LR
  A[EHR / PMS / Referring App] --> B[Transport: API, SFTP, MLLP]
  B --> C[Parser: HL7 v2, X12 278, FHIR, CSV]
  C --> D[Validation + Debug Log]
  D --> E[Normalized PriorAuthRequest]
  E --> F[Routing + Payer Rules]
  F --> G[Payer / Clearinghouse / Portal]
  D --> H[Monitoring + Customer Support]`}</pre>
      </SectionCard>

      <SectionCard title="Requirements-gathering checklist" eyebrow="Discovery">
        <ul className="grid gap-3 md:grid-cols-2">
          {checklist.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Authentication and credential documentation" eyebrow="OAuth2, API keys, mTLS, and SFTP">
        <ul className="grid gap-3 md:grid-cols-2">
          {authFlowChecklist.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Production monitoring signals" eyebrow="Operational readiness">
        <ul className="grid gap-3 md:grid-cols-2">
          {monitoringSignals.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{item}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Normalized prior-auth API schema" eyebrow="Example payload">
        <p className="mb-3 text-sm text-slate-600">
          The internal schema creates a stable contract even when sources differ across HL7 v2, X12 278, FHIR, and custom APIs.
        </p>
        <pre className="rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{JSON.stringify(schemaExample, null, 2)}</pre>
      </SectionCard>
    </div>
  );
}
