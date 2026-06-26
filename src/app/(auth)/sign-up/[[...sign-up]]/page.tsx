import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { authPageAppearance } from "@/config/clerk-appearance";
import { siteConfig } from "@/config/site";

export default function SignUpPage() {
  return (
    <AuthShell
      title={siteConfig.auth.signUp.title}
      description={siteConfig.auth.signUp.description}
      alternateLabel="Already have an account?"
      alternateHref="/sign-in"
    >
      <SignUp
        appearance={authPageAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
