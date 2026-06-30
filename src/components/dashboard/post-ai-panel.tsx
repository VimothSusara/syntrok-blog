"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import {
  generatePostSeoMetaAction,
  generatePostSummaryAction,
  improvePostWritingAction,
  suggestPostTagsAction,
} from "@/app/dashboard/posts/ai-actions";
import { applySuggestedTagsAction } from "@/app/dashboard/posts/taxonomy-actions";
import { plainTextToTiptapJson } from "@/lib/posts/content";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PostAiPanelProps = {
  postId?: string;
  title: string;
  content: string;
  selectedTagIds: string[];
  onApplySummary: (summary: string) => void;
  onApplySeoMeta: (meta: { title: string; description: string }) => void;
  onApplyContent: (contentJson: string) => void;
  onApplyTags: (input: {
    tagIds: string[];
    tags: { id: string; name: string; slug: string }[];
  }) => void;
};

export function PostAiPanel({
  postId,
  title,
  content,
  selectedTagIds,
  onApplySummary,
  onApplySeoMeta,
  onApplyContent,
  onApplyTags,
}: PostAiPanelProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [unmatchedTags, setUnmatchedTags] = useState<string[]>([]);
  const [writingPreview, setWritingPreview] = useState<string | null>(null);

  const run = (task: () => Promise<void>) => {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await task();
      } catch (e) {
        setError(e instanceof Error ? e.message : "AI request failed.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4" />
          AI assistant
        </CardTitle>
        <CardDescription>
          Generate drafts for summary, SEO, tags, or writing improvements.
          Results are applied to the fields above.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run(async () => {
                const result = await generatePostSummaryAction(content, postId);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                onApplySummary(result.data!);
                setMessage("Summary applied to the summary field.");
              })
            }
          >
            Summarize
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run(async () => {
                const result = await generatePostSeoMetaAction(
                  content,
                  title,
                  postId,
                );
                if (result.error) {
                  setError(result.error);
                  return;
                }
                onApplySeoMeta(result.data!);
                setMessage("SEO title and description applied.");
              })
            }
          >
            SEO meta
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run(async () => {
                const result = await suggestPostTagsAction(content, postId);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setSuggestedTags(result.data ?? []);
                setUnmatchedTags([]);
                setMessage("Tag suggestions ready. Click apply to add them.");
              })
            }
          >
            Suggest tags
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={pending}
            onClick={() =>
              run(async () => {
                const result = await improvePostWritingAction(content, postId);
                if (result.error) {
                  setError(result.error);
                  return;
                }
                setWritingPreview(result.data ?? null);
                setMessage("Writing suggestion ready.");
              })
            }
          >
            Improve writing
          </Button>
        </div>

        {suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggested tags</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() =>
                run(async () => {
                  const result = await applySuggestedTagsAction(
                    suggestedTags,
                    selectedTagIds,
                  );
                  if (result.error) {
                    setError(result.error);
                    return;
                  }

                  const { tagIds, tags, created, unmatched } = result.data!;
                  onApplyTags({ tagIds, tags });
                  setUnmatchedTags(unmatched);

                  if (created.length > 0) {
                    setMessage(`Applied tags. Created: ${created.join(", ")}.`);
                  } else if (unmatched.length > 0) {
                    setMessage(
                      `Applied matching tags. No match for: ${unmatched.join(", ")}. Use + next to Tags to create them.`,
                    );
                  } else {
                    setMessage("Tags applied to the tags field.");
                  }
                })
              }
            >
              Apply tags
            </Button>
            {unmatchedTags.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Unmatched: {unmatchedTags.join(", ")}
              </p>
            ) : null}
          </div>
        )}

        {writingPreview ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Writing preview</p>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-muted/30 p-3 text-xs whitespace-pre-wrap">
              {writingPreview}
            </pre>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => {
                onApplyContent(plainTextToTiptapJson(writingPreview));
                setWritingPreview(null);
                setMessage("Writing suggestion applied to content.");
              }}
            >
              Apply to content
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
