"use client";

import { useActionState } from "react";
import type { OnboardingActionState } from "@/app/onboarding/actions";
import { completeOnboardingAction } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: OnboardingActionState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    completeOnboardingAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="username"
          name="username"
          placeholder="jane-doe"
          autoComplete="username"
          required
        />
        <p className="text-xs text-muted-foreground">
          This creates your public author page at /authors/your-username.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio <span className="text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="A short intro for readers."
          rows={4}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Continue to dashboard"}
      </Button>
    </form>
  );
}
