import "server-only";

import { createHash } from "crypto";

export function hashIp(ip: string): string {
  const salt = process.env.AUDIT_IP_SALT ?? "dev-audit-salt-change-me";
  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}
