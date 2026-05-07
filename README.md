# Prior Auth Integration Lab

A lightweight full-stack local Next.js app for learning the basics of HL7 v2 and X12 278 healthcare data transactions in the context of prior authorization integration work.

## Why this exists

This project is an educational interview-prep sandbox for a healthcare integrations Solutions Engineer role. It assumes familiarity with FHIR, Epic/Cerner APIs, REST APIs, authentication, and file transfers, then introduces HL7 v2 and X12/EDI through hands-on parsing, mapping, validation, and debugging examples.

## Setup commands

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

Useful checks:

```bash
npm run typecheck
npm run build
```

## What the app demonstrates

- A dashboard explaining HL7 v2, X12 278, and normalized prior-auth workflow data.
- An HL7 v2 ADT-like parser for `MSH`, `PID`, `PV1`, and `IN1` segments.
- A simplified educational X12 278 parser for envelope metadata, patient/subscriber, payer, provider, service review, diagnosis, and procedure/service data.
- A 278 loop learning mode for common concepts:
  - `2000E` patient event / health care services review level
  - `2010EA` patient name
  - `2010EB` patient event provider
- A normalized `PriorAuthRequest` TypeScript model used by both parsers.
- A validation engine that separates blocking errors from warnings.
- Debugging scenarios for missing patient identifier, invalid date format, and payer ID mismatch.
- Documentation, Humata-style integration playbook, and talking-points pages for interview preparation.
- Role-specific enablement artifacts for 278R response flow, 275 attachments, REST APIs, SFTP, VPN/mTLS, SQL audits, packet tracing, Newman smoke tests, monitoring, and standardized error envelopes.

## What this app does **not** do

- It is **not** a production EDI parser.
- It does **not** implement the full X12 278 standard, licensing model, or official implementation guides.
- It does **not** replace payer companion guides or trading-partner certification.
- It does **not** store PHI, maintain a database, or provide production audit logging.
- It does **not** submit real authorization requests to payers.
- It does **not** establish VPN tunnels, perform packet captures, run SQL against a database, or transmit real 275 attachments.

## Suggested future improvements

- Integrate a real licensed EDI parser for X12 validation and compliance.
- Add persistent database logging for raw payloads, parsed output, validation results, and audit trails.
- Add a Postman/Newman test suite with positive and negative integration fixtures.
- Simulate Mirth Connect / NextGen Connect channels for HL7 v2 ingestion and transformations.
- Add SFTP and MLLP local transport simulations.
- Add payer-specific companion-guide configuration profiles.
- Add FHIR `Patient`, `Coverage`, `Practitioner`, `Organization`, and `ServiceRequest` mapping examples.
- Add status response parsing and reconciliation workflows.
- Add downloadable Postman collections, SQL fixture data, and a Mirth Connect channel export.
