import { AiAdminPageContent } from "@/components/dashboard/admin/ai-admin-page-content";
import { getAiAdminOverview } from "@/lib/db/ai-admin";

export default async function AdminAiPage() {
  const overview = await getAiAdminOverview();
  return <AiAdminPageContent overview={overview} />;
}
