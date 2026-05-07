export const loopMappings = [
  {
    loop: "2000E",
    concept: "Patient event / health care services review level",
    sourceExample: "HL*4*3*EV*0 + UM service-review details",
    internalPath: "request.requestType, request.serviceDate, request.procedureCodes",
    note: "Often anchors the service review event. Usage can vary by implementation and companion guide.",
  },
  {
    loop: "2010EA",
    concept: "Patient name",
    sourceExample: "NM1*IL*1*DOE*JANE****MI*MEM987654",
    internalPath: "patient.firstName, patient.lastName, patient.memberId",
    note: "The patient may be the subscriber or dependent depending on the transaction context.",
  },
  {
    loop: "2010EB",
    concept: "Patient event provider",
    sourceExample: "NM1*1P*2*GOODHEALTH CLINIC*****XX*1234567893",
    internalPath: "provider.name, provider.npi",
    note: "Provider role and identifier requirements should be verified against payer companion guidance.",
  },
];
