import type {
  UserModerationRole,
  UserModerationStatus,
} from "@/lib/search-params/user-admin";

export type UserAdminRow = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  imageUrl: string | null;
  role: UserModerationRole;
  status: UserModerationStatus;
  createdAt: Date;
  lastLoginAt: Date | null;
  suspendedAt: Date | null;
  bannedAt: Date | null;
  _count: {
    posts: number;
    comments: number;
  };
};
