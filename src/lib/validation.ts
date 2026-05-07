import type { PriorAuthRequest, ValidationResult } from "./types";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function validatePriorAuthRequest(request: PriorAuthRequest): ValidationResult {
  const errors = [...request.metadata.validationErrors];
  const warnings = [...request.metadata.warnings];

  if (!request.patient.firstName || !request.patient.lastName) {
    errors.push("Patient first and last name are required.");
  }
  if (!request.patient.dateOfBirth) {
    errors.push("Patient date of birth is required.");
  } else if (!isoDatePattern.test(request.patient.dateOfBirth)) {
    errors.push("Patient date of birth must be normalized to YYYY-MM-DD.");
  }
  if (!request.patient.memberId && !request.patient.mrn) {
    errors.push("Either member ID or MRN is required.");
  }
  if (!request.payer?.name && !request.payer?.payerId) {
    errors.push("Payer name or payer ID is required.");
  }
  if (!request.provider?.name && !request.provider?.npi) {
    errors.push("Provider name or NPI is required.");
  }
  const hasCodes = Boolean(request.request.diagnosisCodes?.length || request.request.procedureCodes?.length);
  if (!hasCodes) {
    errors.push("At least one diagnosis code or procedure/service code is required.");
  }
  if (!request.request.serviceDate) {
    warnings.push("Service date is missing; many payers require it for prior authorization.");
  } else if (!isoDatePattern.test(request.request.serviceDate)) {
    errors.push("Service date must be normalized to YYYY-MM-DD.");
  }
  if (request.payer?.payerId && request.payer.payerId !== "PAY123") {
    errors.push(`Payer ID mismatch: expected PAY123 for this lab scenario but received ${request.payer.payerId}.`);
  }

  return { errors, warnings, isValid: errors.length === 0 };
}
