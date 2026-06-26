import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { authPageAppearance } from "@/config/clerk-appearance";
import { siteConfig } from "@/config/site";

export default function SignInPage() {
  return (
    <AuthShell
      title={siteConfig.auth.signIn.title}
      description={siteConfig.auth.signIn.description}
      alternateLabel="Don't have an account?"
      alternateHref="/sign-up"
    >
      <SignIn
        appearance={authPageAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
