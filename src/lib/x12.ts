import type { ParsedX12, PriorAuthRequest } from "./types";
import { validatePriorAuthRequest } from "./validation";

// Educational parser only: X12 278 production handling should use a licensed/validated EDI
// parser and the applicable implementation + payer companion guides. This intentionally
// demonstrates delimiters, envelope parsing, selected loops, and normalization concepts only.
function normalizeX12Date(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^\d{8}$/.test(value)) return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  return value;
}

function segmentElements(segments: ParsedX12["segments"], tag: string): string[] | undefined {
  return segments.find((segment) => segment.tag === tag)?.elements;
}

export function parseX12Payload(raw: string): ParsedX12 {
  const segments = raw
    .trim()
    .split("~")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((line) => {
      const [tag, ...elements] = line.split("*");
      return { tag, elements, raw: line };
    });

  const isa = segmentElements(segments, "ISA");
  const gs = segmentElements(segments, "GS");
  const st = segmentElements(segments, "ST");
  const bht = segmentElements(segments, "BHT");
  const dmg = segmentElements(segments, "DMG");
  const trn = segmentElements(segments, "TRN");
  const um = segmentElements(segments, "UM");
  const hcr = segmentElements(segments, "HCR");
  const msg = segmentElements(segments, "MSG");

  const nm1Segments = segments.filter((segment) => segment.tag === "NM1");
  const payerNm1 = nm1Segments.find((segment) => segment.elements[0] === "PR");
  const providerNm1 = nm1Segments.find((segment) => segment.elements[0] === "1P");
  const subscriberNm1 = nm1Segments.find((segment) => segment.elements[0] === "IL");

  const hi = segmentElements(segments, "HI") ?? [];
  const sv1 = segmentElements(segments, "SV1") ?? [];
  const diagnosisCodes = hi.map((item) => item.split(":")[1]).filter(Boolean);
  const procedureCodes = sv1[0] ? [sv1[0].split(":")[1] ?? sv1[0]] : [];

  const normalized: PriorAuthRequest = {
    sourceType: "X12_278",
    patient: {
      lastName: subscriberNm1?.elements[2],
      firstName: subscriberNm1?.elements[3],
      dateOfBirth: normalizeX12Date(dmg?.[1]),
      sex: dmg?.[2],
      memberId: subscriberNm1?.elements[8],
    },
    payer: {
      name: payerNm1?.elements[2],
      payerId: payerNm1?.elements[8],
    },
    provider: {
      name: providerNm1?.elements[2],
      npi: providerNm1?.elements[8],
    },
    request: {
      requestType: um?.[0] === "AR" ? "Admission/service authorization request" : um?.[0] ?? "278R response/status",
      serviceDate: normalizeX12Date(um?.[4]),
      diagnosisCodes,
      procedureCodes,
      status: hcr?.[0] ? `${hcr[0]} ${hcr[1] ?? ""}`.trim() : msg?.[0] ?? "Parsed from simplified X12 278 sample",
    },
    metadata: {
      transactionId: trn?.[1] ?? bht?.[2] ?? st?.[1],
      receivedAt: new Date().toISOString(),
      validationErrors: [],
      warnings: ["Simplified X12 parser; loop interpretation varies by 278 implementation and companion guide."],
    },
  };

  const validation = validatePriorAuthRequest(normalized);
  normalized.metadata.validationErrors = validation.errors;
  normalized.metadata.warnings = validation.warnings;

  return {
    segments,
    envelope: {
      interchangeControlNumber: isa?.[12],
      senderId: isa?.[5]?.trim(),
      receiverId: isa?.[7]?.trim(),
      functionalGroupControlNumber: gs?.[5],
      transactionSetControlNumber: st?.[1],
      implementationGuide: st?.[2],
    },
    normalized,
  };
}
