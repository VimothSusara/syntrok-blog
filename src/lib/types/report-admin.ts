import type {
  ReportStatus,
  ReportTargetType,
} from "../../../generated/prisma/client";

export type ReportAdminRow = {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: Date;
  reviewedAt: Date | null;
  reporter: {
    id: string;
    name: string | null;
    email: string;
    username: string | null;
  } | null;
  targetSummary: string;
  targetHref: string | null;
};
