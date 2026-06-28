import type { UserJSON } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { UserRole } from "../../../../../generated/prisma/client";
import { ROLES } from "@/lib/auth/constants";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

function resolveRole(publicMetadata: UserJSON["public_metadata"]): UserRole {
  const role = (publicMetadata as { role?: string } | undefined)?.role;
  return role === ROLES.SUPERADMIN ? UserRole.SUPERADMIN : UserRole.USER;
}

function getPrimaryEmail(data: UserJSON): string | undefined {
  const emails = data.email_addresses ?? [];

  if (data.primary_email_address_id) {
    return emails.find((e) => e.id === data.primary_email_address_id)
      ?.email_address;
  }

  return emails[0]?.email_address;
}

function getDisplayName(data: UserJSON): string | null {
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
  return name || null;
}

async function syncUser(data: UserJSON) {
  const email = getPrimaryEmail(data);
  if (!email) {
    throw new Error("Missing primary email");
  }

  await prisma.user.upsert({
    where: { clerkId: data.id },
    update: {
      email,
      name: getDisplayName(data),
      imageUrl: data.image_url ?? null,
      role: resolveRole(data.public_metadata),
    },
    create: {
      clerkId: data.id,
      email,
      username: null,
      name: getDisplayName(data),
      imageUrl: data.image_url ?? null,
      role: resolveRole(data.public_metadata),
    },
  });
}

async function deleteUser(clerkId: string) {
  await prisma.user.deleteMany({
    where: { clerkId },
  });
}

export async function POST(req: NextRequest) {
  const signingSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!signingSecret) {
    return new Response("Missing webhook secret", { status: 500 });
  }

  let event;
  try {
    // Do not call req.json() before this — verifyWebhook needs the raw body
    event = await verifyWebhook(req, { signingSecret });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await syncUser(event.data);
        break;

      case "user.deleted": {
        const clerkId = event.data.id;
        if (clerkId) {
          await deleteUser(clerkId);
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Clerk webhook handler error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
