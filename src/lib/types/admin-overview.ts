import type {
  AuditAction,
  AuditEntityType,
} from "../../../generated/prisma/client";

export type AdminOverviewStats = {
  users: {
    total: number;
    active: number;
    suspended: number;
    banned: number;
  };
  posts: {
    published: number;
    draft: number;
  };
  comments: {
    total: number;
    hidden: number;
  };
  taxonomy: {
    categories: number;
    tags: number;
  };
  reports: {
    open: number;
  };
};

export type AdminOverviewAuditRow = {
  id: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string | null;
  createdAt: Date;
  actor: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};
