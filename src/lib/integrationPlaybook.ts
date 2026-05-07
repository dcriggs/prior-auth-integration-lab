export type IntegrationArtifact = {
  title: string;
  jobSignal: string;
  howToTalkAboutIt: string;
  labExample: string;
  customerQuestion: string;
};

export type ErrorEnvelope = {
  correlationId: string;
  sourceSystem: string;
  transactionType: "278R_REQUEST" | "278R_RESPONSE" | "275_ATTACHMENT" | "REST_API" | "SFTP_FILE";
  severity: "ERROR" | "WARNING" | "INFO";
  category: "SCHEMA_VALIDATION" | "BUSINESS_RULE" | "CONNECTIVITY" | "AUTHENTICATION" | "ROUTING" | "TIMEOUT";
  retryable: boolean;
  customerMessage: string;
  technicalDetails: string;
  nextAction: string;
};

export const integrationArtifacts: IntegrationArtifact[] = [
  {
    title: "278R request/response ownership",
    jobSignal: "278R EDI transactions, service type codes, request/response data flow, segment looping",
    howToTalkAboutIt:
      "I would trace the request from source-system event through normalized intake, payer routing, 278R submission, response reconciliation, and downstream workqueue update.",
    labExample: "The X12 parser extracts envelope, payer, provider, subscriber, service review, diagnosis, and procedure data before validation.",
    customerQuestion: "Which 278R implementation guide and payer companion guides define your required loops, qualifiers, service type codes, and response handling?",
  },
  {
    title: "275 supporting documentation workflow",
    jobSignal: "275 EDI document management workflows for clinical attachments",
    howToTalkAboutIt:
      "I would keep attachment metadata, control numbers, document hashes, and prior-auth correlation IDs together so clinical documentation can be matched to the correct authorization request.",
    labExample: "The 275 mock workflow below shows how a PDF or clinical note package can be staged, hashed, transmitted, acknowledged, and reconciled.",
    customerQuestion: "What document types, size limits, naming conventions, and attachment control-number rules does each payer require?",
  },
  {
    title: "REST API and synchronous exchange",
    jobSignal: "RESTful APIs, OAuth2, API keys, schema validation, pagination, rate limiting, error handling",
    howToTalkAboutIt:
      "I document request/response schemas, auth flows, idempotency keys, rate-limit behavior, and customer-safe error messages before go-live.",
    labExample: "The normalized payload schema can be sent by API routes or server actions and validated before payer routing.",
    customerQuestion: "Do you need synchronous authorization status lookup, webhook notifications, polling, or all three?",
  },
  {
    title: "SFTP and file-based batches",
    jobSignal: "File-based integrations, batched document exchange, retry logic, monitoring",
    howToTalkAboutIt:
      "I define folder contracts, filename conventions, encryption expectations, duplicate detection, acknowledgements, and replay procedures.",
    labExample: "The operational checklist separates transport failures from payload failures so support teams know where to look first.",
    customerQuestion: "What is the expected batch cadence, file naming convention, retention window, and acknowledgement SLA?",
  },
  {
    title: "VPN, IP allowlisting, certificates, and mTLS",
    jobSignal: "B2B VPN tunnels, IP whitelisting, SSL certificates, mutual TLS, AES-256, SHA-256",
    howToTalkAboutIt:
      "I gather endpoint IPs, ports, DNS, certificate chain, cipher requirements, renewal owners, and rollback contacts before scheduling connectivity testing.",
    labExample: "The security checklist gives customer IT a concise discovery template for VPN and credential provisioning.",
    customerQuestion: "Who owns certificate renewal and how much notice is required before production cutover or rotation?",
  },
  {
    title: "SQL-backed validation and audits",
    jobSignal: "CTEs, window functions, migration pre-validation, post-migration audits, data mismatch RCA",
    howToTalkAboutIt:
      "Even when v1 has no database, I can explain audit SQL patterns for duplicate transactions, missing required fields, and source-vs-target reconciliation.",
    labExample: "The SQL snippets are intentionally database-agnostic examples for interview discussion and future database-backed versions.",
    customerQuestion: "Which fields are system-of-record values, and which downstream system should win when mismatches are detected?",
  },
  {
    title: "Packet tracing and connectivity debugging",
    jobSignal: "Wireshark, tcpdump, OpenVPN, packet tracing, connectivity troubleshooting",
    howToTalkAboutIt:
      "I isolate DNS, routing, firewall, TLS handshake, authentication, and application-layer failures with progressively narrower tests.",
    labExample: "The packet-tracing commands show what evidence to collect without exposing PHI in screenshots or packet captures.",
    customerQuestion: "Can both sides provide timestamps, public NAT IPs, tunnel logs, and packet captures for the same failed test window?",
  },
  {
    title: "Automation and production monitoring",
    jobSignal: "Postman, Newman CLI, Swagger Inspector, monitors, alerting, PowerBI/Looker dashboards",
    howToTalkAboutIt:
      "I convert implementation examples into repeatable tests and health dashboards that alert on timeouts, schema failures, and transaction-volume anomalies.",
    labExample: "The Newman collection skeleton validates the normalized payload endpoint and can be extended with payer-specific fixtures.",
    customerQuestion: "What failure scenarios should page someone immediately versus create a next-business-day support task?",
  },
];

export const attachment275Workflow = [
  "Receive attachment trigger from prior-auth workflow with correlation ID and patient/member context.",
  "Stage document metadata: document type, content type, page count, source filename, and prior-auth transaction ID.",
  "Compute SHA-256 hash and store encrypted content location; do not log raw PHI or document text.",
  "Transmit via payer-required method such as X12 275, SFTP package, portal API, or clearinghouse route.",
  "Capture acknowledgement/control numbers and reconcile them to the originating 278R request.",
  "Alert if acknowledgement is missing, rejected, duplicated, or not linked to the expected authorization case.",
];

export const securityChecklist = [
  "Source and destination public IPs, private tunnel CIDRs, ports, protocols, DNS names, and NAT behavior",
  "VPN vendor/profile, tunnel phase settings, encryption algorithms, and keepalive/DPD expectations",
  "TLS certificate chain, expiration dates, SAN/CN values, key length, mTLS client certificate owner, and renewal calendar",
  "Authentication method: OAuth2 client credentials, API key, Basic Auth, trading-partner credentials, or SSH key",
  "Secrets handling: vault location, rotation cadence, break-glass contact, and environment separation",
  "PHI/PII safeguards: encryption in transit, encryption at rest, minimum necessary logging, and redaction rules",
];

export const sqlAuditSnippets = [
  {
    title: "Find duplicate prior-auth transactions by payer transaction ID",
    sql: `WITH ranked AS (
  SELECT
    transaction_id,
    payer_id,
    member_id,
    service_date,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY transaction_id, payer_id
      ORDER BY created_at DESC
    ) AS newest_first,
    COUNT(*) OVER (PARTITION BY transaction_id, payer_id) AS duplicate_count
  FROM prior_auth_requests
)
SELECT *
FROM ranked
WHERE duplicate_count > 1
ORDER BY transaction_id, newest_first;`,
  },
  {
    title: "Pre-validation for missing required normalized fields",
    sql: `SELECT
  source_system,
  correlation_id,
  transaction_id,
  CASE WHEN patient_last_name IS NULL OR patient_first_name IS NULL THEN 'MISSING_PATIENT_NAME' END AS name_issue,
  CASE WHEN date_of_birth IS NULL THEN 'MISSING_DOB' END AS dob_issue,
  CASE WHEN member_id IS NULL AND mrn IS NULL THEN 'MISSING_IDENTIFIER' END AS identifier_issue,
  CASE WHEN payer_id IS NULL THEN 'MISSING_PAYER' END AS payer_issue
FROM staged_prior_auth_requests
WHERE patient_last_name IS NULL
   OR patient_first_name IS NULL
   OR date_of_birth IS NULL
   OR (member_id IS NULL AND mrn IS NULL)
   OR payer_id IS NULL;`,
  },
  {
    title: "Post-migration source-vs-target reconciliation",
    sql: `SELECT
  s.correlation_id,
  s.member_id AS source_member_id,
  t.member_id AS target_member_id,
  s.status AS source_status,
  t.status AS target_status
FROM source_prior_auth_export s
FULL OUTER JOIN target_prior_auth_requests t
  ON s.correlation_id = t.correlation_id
WHERE t.correlation_id IS NULL
   OR s.correlation_id IS NULL
   OR COALESCE(s.member_id, '') <> COALESCE(t.member_id, '')
   OR COALESCE(s.status, '') <> COALESCE(t.status, '');`,
  },
];

export const packetTracingCommands = [
  {
    title: "Verify TCP reachability to an API endpoint",
    command: "nc -vz api.customer.example 443",
    note: "Use before deeper TLS/API debugging to prove whether the port is reachable.",
  },
  {
    title: "Capture non-PHI VPN handshake metadata",
    command: "sudo tcpdump -i tun0 host 203.0.113.10 and port 443 -w vpn-handshake.pcap",
    note: "Coordinate capture windows and avoid storing payload content unless approved by security policy.",
  },
  {
    title: "Inspect certificate chain and expiration",
    command: "openssl s_client -connect api.customer.example:443 -showcerts </dev/null",
    note: "Useful for mTLS/TLS chain issues, expired certificates, and hostname mismatches.",
  },
];

export const postmanCollectionExample = {
  info: {
    name: "Prior Auth Integration Lab Smoke Tests",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "Parse HL7 sample",
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        url: "{{baseUrl}}/api/parse/hl7",
        body: { mode: "raw", raw: JSON.stringify({ raw: "{{hl7Sample}}" }) },
      },
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('returns normalized HL7 payload', function () {",
              "  pm.expect(pm.response.json().normalized.sourceType).to.eql('HL7_V2');",
              "});",
            ],
          },
        },
      ],
    },
    {
      name: "Parse X12 278 sample",
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        url: "{{baseUrl}}/api/parse/x12",
        body: { mode: "raw", raw: JSON.stringify({ raw: "{{x12Sample}}" }) },
      },
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('returns normalized X12 payload', function () {",
              "  pm.expect(pm.response.json().normalized.sourceType).to.eql('X12_278');",
              "});",
            ],
          },
        },
      ],
    },
  ],
};

export const standardizedErrorExample: ErrorEnvelope = {
  correlationId: "corr-20260507-0001",
  sourceSystem: "Epic Interconnect / SFTP batch",
  transactionType: "278R_REQUEST",
  severity: "ERROR",
  category: "SCHEMA_VALIDATION",
  retryable: false,
  customerMessage: "The authorization request is missing a patient identifier required for payer submission.",
  technicalDetails: "PID-3 and normalized patient.memberId/patient.mrn were empty after parsing.",
  nextAction: "Ask the EMR analyst to confirm MRN/member ID mapping and resend the corrected payload.",
};
