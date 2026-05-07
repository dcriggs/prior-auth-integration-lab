import { NextResponse } from "next/server";
import { parseHl7Message } from "@/lib/hl7";

export async function POST(request: Request) {
  const body = (await request.json()) as { raw?: string };
  return NextResponse.json(parseHl7Message(body.raw ?? ""));
}
