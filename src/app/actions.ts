"use server";

import { parseHl7Message } from "@/lib/hl7";
import { parseX12Payload } from "@/lib/x12";

export async function parseHl7Action(raw: string) {
  return parseHl7Message(raw);
}

export async function parseX12Action(raw: string) {
  return parseX12Payload(raw);
}
