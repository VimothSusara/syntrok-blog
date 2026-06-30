import { createHash } from "node:crypto";

export function buildAiInputHash(input: {
  featureKey: string;
  modelSlug: string;
  variables: Record<string, string>;
}) {
  const payload = JSON.stringify({
    featureKey: input.featureKey,
    modelSlug: input.modelSlug,
    variables: input.variables,
  });

  return createHash("sha256").update(payload).digest("hex");
}
