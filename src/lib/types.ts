export type SourceType = "HL7_V2" | "X12_278" | "FHIR" | "CUSTOM_API";

export type PriorAuthRequest = {
  sourceType: SourceType;
  patient: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    sex?: string;
    memberId?: string;
    mrn?: string;
  };
  payer?: {
    name?: string;
    payerId?: string;
  };
  provider?: {
    name?: string;
    npi?: string;
  };
  request: {
    requestType?: string;
    serviceDate?: string;
    diagnosisCodes?: string[];
    procedureCodes?: string[];
    status?: string;
  };
  metadata: {
    messageControlId?: string;
    transactionId?: string;
    receivedAt: string;
    validationErrors: string[];
    warnings: string[];
  };
};

export type ValidationResult = {
  errors: string[];
  warnings: string[];
  isValid: boolean;
};

export type ParsedHl7 = {
  segments: Array<{ name: string; fields: string[]; raw: string }>;
  normalized: PriorAuthRequest;
};

export type ParsedX12 = {
  segments: Array<{ tag: string; elements: string[]; raw: string }>;
  envelope: Record<string, string | undefined>;
  normalized: PriorAuthRequest;
};
