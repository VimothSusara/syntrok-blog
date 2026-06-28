"use client";

import { useState, useTransition } from "react";
import {
  banUserAction,
  suspendUserAction,
  type UserAdminActionResult,
} from "@/app/dashboard/admin/users/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type UserModerationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userLabel: string;
  mode: "suspend" | "ban";
  onComplete?: (result: UserAdminActionResult) => void;
};

export function UserModerationDialog({
  open,
  onOpenChange,
  userId,
  userLabel,
  mode,
  onComplete,
}: UserModerationDialogProps) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  const submit = () => {
    startTransition(async () => {
      const result =
        mode === "suspend"
          ? await suspendUserAction(userId, reason)
          : await banUserAction(userId, reason);

      onComplete?.(result);

      if (!result.error) {
        setReason("");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "suspend" ? "Suspend user" : "Ban user"}
          </DialogTitle>
          <DialogDescription>
            {mode === "suspend"
              ? `Suspend ${userLabel}. They will not be able to comment until reactivated.`
              : `Ban ${userLabel}. This is a stronger restriction than suspend.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="reason" className="text-sm font-medium">
            Reason <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Internal moderation note"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={mode === "ban" ? "destructive" : "default"}
            disabled={pending}
            onClick={submit}
          >
            {pending ? "Saving…" : mode === "suspend" ? "Suspend" : "Ban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
