import { failedHl7MissingIdentifier, failedX12InvalidDate, failedX12PayerMismatch } from "./samples";
import { parseHl7Message } from "./hl7";
import { parseX12Payload } from "./x12";

export const debugScenarios = [
  {
    title: "Missing patient identifier",
    rawPayload: failedHl7MissingIdentifier,
    parsed: parseHl7Message(failedHl7MissingIdentifier).normalized,
    suggestedSteps: [
      "Confirm PID-3 is populated with an MRN or enterprise identifier.",
      "Check whether member ID is expected in PID-18, IN1, or a downstream eligibility/API call.",
      "Ask the source-system analyst for an example successful message for the same encounter type.",
    ],
    customerExplanation:
      "The message parsed successfully, but it did not include a usable MRN or member ID, so the authorization request cannot be matched to a patient record yet.",
  },
  {
    title: "Invalid date format",
    rawPayload: failedX12InvalidDate,
    parsed: parseX12Payload(failedX12InvalidDate).normalized,
    suggestedSteps: [
      "Verify the companion guide date qualifiers and expected CCYYMMDD format.",
      "Normalize dates before validation and preserve original raw values for audit/debugging.",
      "Add a test fixture for slash-delimited dates so regressions are caught early.",
    ],
    customerExplanation:
      "The request contains dates that are not in the expected normalized format, so it is being held for correction before payer submission.",
  },
  {
    title: "Payer ID mismatch",
    rawPayload: failedX12PayerMismatch,
    parsed: parseX12Payload(failedX12PayerMismatch).normalized,
    suggestedSteps: [
      "Compare NM1*PR payer identifier against the payer routing table.",
      "Confirm whether the payer expects a trading-partner ID, payer ID, or portal-specific identifier.",
      "Update the mapping only after confirming with the payer companion guide or implementation contact.",
    ],
    customerExplanation:
      "The payload appears to target a payer identifier that is not configured for this workflow, so routing is blocked to avoid sending PHI to the wrong destination.",
  },
];
