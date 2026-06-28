import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getPostAuthRedirectPath } from "@/lib/auth/profile";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  redirect(getPostAuthRedirectPath(user));
}
