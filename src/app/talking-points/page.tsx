import { SectionCard } from "@/components/SectionCard";

const sections = [
  {
    title: "API and FHIR experience",
    bullets: [
      "I can translate business workflows into resource/API contracts, auth requirements, request/response examples, and test cases.",
      "FHIR experience gives me a strong mental model for normalized healthcare data even when the source format is HL7 v2 or EDI.",
      "I am comfortable debugging REST calls, auth failures, file-transfer issues, and payload-level data-quality problems.",
    ],
  },
  {
    title: "HL7 and X12 as structured payloads",
    bullets: [
      "HL7 v2 and X12 look unfamiliar at first, but they are structured payloads with delimiters, segments, fields/elements, identifiers, and implementation-specific rules.",
      "My approach is to identify the envelope/control metadata, locate the patient/provider/payer/request sections, then map them to an internal model.",
      "Companion guides and implementation guides are the source of truth for required loops, qualifiers, code sets, and edge cases.",
    ],
  },
  {
    title: "Payload-level debugging",
    bullets: [
      "I preserve the raw payload, parsed tree, normalized output, validation errors, warnings, and correlation IDs so teams can reproduce issues.",
      "I separate parser failures from business-validation failures and routing/configuration failures.",
      "I write small negative fixtures for missing identifiers, invalid dates, payer mismatches, unsupported codes, and duplicate submissions.",
    ],
  },
  {
    title: "Requirements gathering",
    bullets: [
      "I ask about source system ownership, transport, authentication, message version, required fields, volume, SLAs, retries, monitoring, and support contacts.",
      "I request representative happy-path and error-path payloads early, then turn them into mapping docs and test cases.",
      "I confirm who owns clinical, operational, and payer-specific mapping decisions before implementation starts.",
    ],
  },
  {
    title: "Mappings and edge cases",
    bullets: [
      "I document source field, target field, transformation, validation rule, default behavior, and example values for every important mapping.",
      "I call out conditional logic, payer-specific overrides, identifier precedence, timezone/date handling, and code-system assumptions.",
      "I use customer-readable error messages for operational teams and technical logs for engineering escalation.",
    ],
  },
  {
    title: "278R and 275 workflow ownership",
    bullets: [
      "I would describe 278R as both a request and response workflow: submit service-review data, capture payer status/authorization identifiers, and reconcile that result back to the source workflow.",
      "For 275 attachments, I would focus on correlation IDs, control numbers, document metadata, encryption, acknowledgement handling, and payer-specific attachment rules.",
      "I would avoid guessing loop requirements and instead validate 2000E, 2010EA, 2010EB, service type codes, and response segments against the implementation and companion guides.",
    ],
  },
  {
    title: "Security and connectivity",
    bullets: [
      "For VPN and mTLS setup, I gather IPs, ports, DNS, certificate chains, cipher expectations, renewal owners, and test windows before implementation starts.",
      "I troubleshoot connectivity in layers: DNS, route, firewall, VPN tunnel, TCP reachability, TLS handshake, authentication, then application payload.",
      "I keep PHI out of packet captures and logs unless security policy explicitly permits a controlled diagnostic capture.",
    ],
  },
  {
    title: "Automation, SQL, and monitoring",
    bullets: [
      "I turn implementation examples into Postman/Newman smoke tests and negative fixtures for schema, auth, timeout, duplicate, and payer-routing failures.",
      "I use SQL audit patterns such as CTEs and window functions to find duplicate transactions, missing required fields, and source-vs-target mismatches.",
      "I define alert thresholds for volume drops, payer timeouts, validation spikes, SFTP acknowledgement latency, and certificate expiration.",
    ],
  },
  {
    title: "Ramping up on companion guides",
    bullets: [
      "I start with the implementation guide concepts, then compare payer companion-guide deviations loop by loop and qualifier by qualifier.",
      "I build a traceability matrix from guide requirements to parser/validator tests and sample payloads.",
      "I would pair with an EDI expert or payer implementation contact for ambiguous loops instead of guessing in production.",
    ],
  },
];

export default function TalkingPointsPage() {
  return (
    <div className="space-y-6">
      <SectionCard title="Talking Points" eyebrow="Interview prep">
        <p className="text-slate-600">
          Concise ways to connect existing API/FHIR integration experience to HL7 v2, X12 278, prior authorization workflows, and customer-facing debugging.
        </p>
      </SectionCard>
      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <SectionCard key={section.title} title={section.title}>
            <ul className="list-disc space-y-3 pl-5 text-sm leading-6 text-slate-700">
              {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
