import Link from "next/link";
import type { AiAdminOverview } from "@/lib/db/ai-admin";
import { PageHeader } from "@/components/shared/page-header";
import { adminBreadcrumbs } from "@/lib/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AiAdminPageContentProps = {
  overview: AiAdminOverview;
};

function EnabledBadge({ enabled }: { enabled: boolean }) {
  return (
    <Badge variant={enabled ? "secondary" : "outline"}>
      {enabled ? "Enabled" : "Disabled"}
    </Badge>
  );
}

export function AiAdminPageContent({ overview }: AiAdminPageContentProps) {
  const { providers, models, features, templates } = overview;
  const isEmpty =
    !providers.length &&
    !models.length &&
    !features.length &&
    !templates.length;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={adminBreadcrumbs.section("AI config")}
        title="AI configuration"
        description="Read-only overview of providers, models, and feature bindings. Editor controls and toggles are coming in a future release."
      />

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
        <p className="text-muted-foreground">
          In-editor AI tools (summarize, SEO, tags, writing assistant) are not
          wired in the UI yet.
        </p>
        <Button variant="outline" size="sm" asChild>
          <Link href="/coming-soon">Learn more</Link>
        </Button>
      </div>

      {isEmpty ? (
        <p className="rounded-xl border border-border p-6 text-sm text-muted-foreground">
          No AI providers or features are configured in the database yet. Run
          your seed/migration setup to populate defaults.
        </p>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Providers</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {providers.map((provider) => (
                <Card key={provider.id} size="sm">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {provider.displayName}
                      </CardTitle>
                      <EnabledBadge enabled={provider.isEnabled} />
                    </div>
                    <CardDescription>
                      {provider.slug} · {provider._count.models} model
                      {provider._count.models === 1 ? "" : "s"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    API key env:{" "}
                    <code className="rounded bg-muted px-1 py-0.5">
                      {provider.apiKeyEnvVar}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full text-sm">
                <thead className="border-b border-border bg-muted/30 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Feature</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Text model</th>
                    <th className="px-4 py-3 font-medium">Embedding</th>
                    <th className="px-4 py-3 font-medium">Prompt</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr
                      key={feature.id}
                      className="border-b border-border align-top last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium">{feature.displayName}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {feature.featureKey}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <EnabledBadge enabled={feature.isEnabled} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {feature.textModel
                          ? `${feature.textModel.provider.displayName} / ${feature.textModel.displayName}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {feature.embeddingModel
                          ? `${feature.embeddingModel.provider.displayName} / ${feature.embeddingModel.displayName}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {feature.promptTemplate
                          ? `${feature.promptTemplate.name} v${feature.promptTemplate.version}`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {templates.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Recent prompt templates</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-border bg-muted/30 text-left">
                    <tr>
                      <th className="px-4 py-3 font-medium">Key</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Version</th>
                      <th className="px-4 py-3 font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template) => (
                      <tr
                        key={template.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          {template.key}
                        </td>
                        <td className="px-4 py-3">{template.name}</td>
                        <td className="px-4 py-3">{template.version}</td>
                        <td className="px-4 py-3">
                          <EnabledBadge enabled={template.isActive} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
