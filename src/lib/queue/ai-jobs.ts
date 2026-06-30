import { qstashClient } from "@/lib/queue/qstash"
import type { AiJobs } from "@/lib/ai/jobs/types"

export async function enqueueAiJob(
    job: AiJobs,
    options?: { delay?: number; retries?: number }
) {
    await qstashClient.publishJSON({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/qstash/ai`,
        body: job,
        retries: options?.retries ?? 1,
        delay: options?.delay ?? 0,
    })
}