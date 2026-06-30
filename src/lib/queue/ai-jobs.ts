import { dispatchAiJob } from "@/lib/ai/jobs/dispatcher";
import type { AiJobs } from "@/lib/ai/jobs/types";
import { qstashClient } from "@/lib/queue/qstash";

export async function enqueueAiJob(
  job: AiJobs,
  options?: { delay?: number; retries?: number },
) {
  if (process.env.QSTASH_DEV === "true") {
    await dispatchAiJob(job);
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
  }

  await qstashClient.publishJSON({
    url: `${appUrl}/api/qstash/ai`,
    body: job,
    retries: options?.retries ?? 2,
    delay: options?.delay ?? 0,
  });
}
