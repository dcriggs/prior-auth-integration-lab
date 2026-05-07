import { NextResponse } from "next/server";
import { parseX12Payload } from "@/lib/x12";

export async function POST(request: Request) {
  const body = (await request.json()) as { raw?: string };
  return NextResponse.json(parseX12Payload(body.raw ?? ""));
}
