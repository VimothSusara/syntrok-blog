import { NextRequest, NextResponse } from "next/server";
import type { AiJobs } from "@/lib/ai/jobs/types";
import { dispatchAiJob } from "@/lib/ai/jobs/dispatcher";
import { qstashReceiver } from "@/lib/queue/qstash";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  if (process.env.QSTASH_DEV !== "true") {
    const signature = request.headers.get("upstash-signature") ?? "";

    try {
      const valid = await qstashReceiver.verify({
        signature,
        body: rawBody,
      });

      if (!valid) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let job: AiJobs;
  try {
    job = JSON.parse(rawBody) as AiJobs;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await dispatchAiJob(job);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[qstash/ai] job failed", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Job failed",
      },
      { status: 500 },
    );
  }
}
