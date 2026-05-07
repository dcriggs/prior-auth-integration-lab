import { LabDashboard } from "@/components/LabDashboard";
import { parseHl7Message } from "@/lib/hl7";
import { sampleHl7Message, sampleX12Payload } from "@/lib/samples";
import { parseX12Payload } from "@/lib/x12";

export default function Home() {
  return <LabDashboard initialHl7={parseHl7Message(sampleHl7Message)} initialX12={parseX12Payload(sampleX12Payload)} />;
}
