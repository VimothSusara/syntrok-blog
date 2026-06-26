import "server-only";

import { headers } from "next/headers";
import { hashIp } from "@/lib/audit/hash-ip";

export async function getRequestAuditContext() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const rawIp =
    forwarded?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? undefined;
  const userAgent = h.get("user-agent")?.slice(0, 512) ?? undefined;

  return {
    ipAddress: rawIp ? hashIp(rawIp) : undefined,
    userAgent,
    requestId: h.get("x-request-id") ?? undefined,
  };
}
