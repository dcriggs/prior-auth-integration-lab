import { NextResponse } from "next/server";
import {
  attachment275Workflow,
  integrationArtifacts,
  packetTracingCommands,
  securityChecklist,
  sqlAuditSnippets,
  standardizedErrorExample,
} from "@/lib/integrationPlaybook";

export async function GET() {
  return NextResponse.json({
    integrationArtifacts,
    attachment275Workflow,
    securityChecklist,
    standardizedErrorExample,
    sqlAuditSnippets,
    packetTracingCommands,
  });
}
