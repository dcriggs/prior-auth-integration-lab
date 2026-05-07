import type { ParsedHl7, PriorAuthRequest } from "./types";
import { validatePriorAuthRequest } from "./validation";

function normalizeHl7Date(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^\d{8}$/.test(value)) return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  return value;
}

function splitComposite(value?: string): string[] {
  return value?.split("^") ?? [];
}

export function parseHl7Message(raw: string): ParsedHl7 {
  const segments = raw
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [name, ...fields] = line.split("|");
      return { name, fields, raw: line };
    });

  const segment = (name: string) => segments.find((item) => item.name === name);
  const msh = segment("MSH");
  const pid = segment("PID");
  const pv1 = segment("PV1");
  const in1 = segment("IN1");

  const patientName = splitComposite(pid?.fields[4]);
  const patientIds = splitComposite(pid?.fields[2]);
  const accountOrMember = pid?.fields[17];
  const provider = splitComposite(pv1?.fields[5]);
  const payerId = in1?.fields[2];
  const payerName = in1?.fields[3];

  const normalized: PriorAuthRequest = {
    sourceType: "HL7_V2",
    patient: {
      lastName: patientName[0],
      firstName: patientName[1],
      dateOfBirth: normalizeHl7Date(pid?.fields[6]),
      sex: pid?.fields[7],
      mrn: patientIds[0],
      memberId: accountOrMember,
    },
    payer: {
      name: payerName,
      payerId,
    },
    provider: {
      name: [provider[2], provider[1]].filter(Boolean).join(" ") || undefined,
      npi: provider[0],
    },
    request: {
      requestType: "Admission/visit notification used as prior-auth intake seed",
      serviceDate: normalizeHl7Date(pv1?.fields[43]?.slice(0, 8)),
      diagnosisCodes: [],
      procedureCodes: [],
      status: "Parsed from HL7 ADT-like sample",
    },
    metadata: {
      messageControlId: msh?.fields[8],
      receivedAt: new Date().toISOString(),
      validationErrors: [],
      warnings: [
        "HL7 ADT messages usually start an intake workflow; clinical codes may arrive in other segments/messages or downstream APIs.",
      ],
    },
  };

  const validation = validatePriorAuthRequest(normalized);
  normalized.metadata.validationErrors = validation.errors;
  normalized.metadata.warnings = validation.warnings;

  return { segments, normalized };
}
