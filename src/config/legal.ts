import { siteConfig } from "@/config/site";

export const legalLastUpdated = "June 24, 2026";

export const termsSections = [
  {
    title: "Acceptance of terms",
    body: `By accessing or using ${siteConfig.name}, you agree to these Terms of Service. If you do not agree, do not use the platform.`,
  },
  {
    title: "Accounts",
    body: `You are responsible for your account credentials and for all activity under your account. You must provide accurate profile information and keep it up to date. We may suspend or terminate accounts that violate these terms or harm the community.`,
  },
  {
    title: "User content",
    body: `You retain ownership of content you publish. By posting, you grant ${siteConfig.name} a non-exclusive license to host, display, and distribute your content on the platform. You must not post unlawful, abusive, infringing, or misleading content.`,
  },
  {
    title: "Moderation",
    body: `We may remove content, restrict accounts, or take other moderation actions at our discretion to protect users and the platform. Superadmin actions may be recorded in an audit log.`,
  },
  {
    title: "AI-assisted features",
    body: `AI-generated suggestions are provided as-is. You are responsible for reviewing and publishing content. Do not rely on AI output for legal, medical, or financial advice.`,
  },
  {
    title: "Disclaimer",
    body: `The platform is provided "as is" without warranties. To the fullest extent permitted by law, ${siteConfig.name} is not liable for indirect or consequential damages arising from use of the service.`,
  },
  {
    title: "Changes",
    body: `We may update these terms from time to time. Continued use after changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "Contact",
    body: `Questions about these terms: ${siteConfig.contactEmail}`,
  },
] as const;

export const privacySections = [
  {
    title: "Overview",
    body: `This Privacy Policy explains how ${siteConfig.name} collects, uses, and protects information when you use our website and services.`,
  },
  {
    title: "Information we collect",
    body: `We collect information you provide (name, email, username, bio, posts, comments), authentication data via our identity provider (Clerk), usage data (views, timestamps), and technical data (hashed IP addresses in audit logs, user agent snippets).`,
  },
  {
    title: "How we use information",
    body: `We use data to operate the platform, authenticate users, publish content, moderate abuse, improve performance, and maintain security audit trails for sensitive admin actions.`,
  },
  {
    title: "Third-party services",
    body: `We use trusted providers including Clerk (authentication), Neon/PostgreSQL (database), Cloudinary (media), Vercel (hosting), and optionally Google Gemini (AI features). Each provider processes data under their own policies.`,
  },
  {
    title: "Cookies and local storage",
    body: `We use cookies and similar technologies for authentication sessions, theme preferences, and essential site functionality.`,
  },
  {
    title: "Data retention",
    body: `We retain account and content data while your account is active. Deleted content may remain in backups for a limited period. Audit logs may be retained for security and compliance.`,
  },
  {
    title: "Your rights",
    body: `Depending on your jurisdiction, you may request access, correction, or deletion of personal data. Contact us to submit a request.`,
  },
  {
    title: "Contact",
    body: `Privacy inquiries: ${siteConfig.contactEmail}`,
  },
] as const;

export const helpSections = [
  {
    title: "Getting started",
    body: `Create an account, complete onboarding (username + bio), then open Dashboard → My posts to write your first article.`,
  },
  {
    title: "Publishing",
    body: `Posts can be saved as drafts or published when ready. Published posts appear on /posts and on your public author profile.`,
  },
  {
    title: "Comments",
    body: `Signed-in users can comment on published posts. Moderators may hide or remove comments that violate community guidelines.`,
  },
  {
    title: "Following authors",
    body: `Visit an author's profile and click Follow to stay updated on their work. A dedicated following feed may be added in a future release.`,
  },
  {
    title: "Account issues",
    body: `If your account is suspended or you cannot sign in, contact ${siteConfig.contactEmail} from the email address linked to your account.`,
  },
] as const;
