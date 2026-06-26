import { dark, shadcn } from "@clerk/ui/themes";
import type { Appearance } from "@clerk/ui";

const clerkVariables = {
  colorPrimary: "var(--primary)",
  colorPrimaryForeground: "var(--primary-foreground)",
  colorForeground: "var(--foreground)",
  colorMuted: "var(--muted)",
  colorMutedForeground: "var(--muted-foreground)",
  colorBackground: "var(--background)",
  colorInput: "var(--input)",
  colorInputForeground: "var(--foreground)",
  colorBorder: "var(--border)",
  colorRing: "var(--ring)",
  colorDanger: "var(--destructive)",
  colorNeutral: "var(--foreground)",
  colorModalBackdrop: "color-mix(in oklch, var(--background) 60%, transparent)",
  borderRadius: "var(--radius)",
  fontFamily: "var(--font-geist-sans)",
  fontFamilyButtons: "var(--font-geist-sans)",
  fontSize: "0.875rem",
  spacingUnit: "1rem",
} as const;

const clerkElements = {
  rootBox: "w-full",
  cardBox: "w-full",
  card: "shadow-none border border-border bg-card text-card-foreground rounded-xl p-3 sm:p-6",
  headerTitle: "text-2xl font-semibold tracking-tight text-foreground",
  headerSubtitle: "text-sm text-muted-foreground",
  socialButtonsBlockButton:
    "h-11 border border-border bg-background text-foreground hover:bg-muted",
  formButtonPrimary:
    "h-11 text-sm font-medium shadow-none bg-primary text-primary-foreground hover:opacity-90",
  formFieldInput:
    "h-11 rounded-md border border-input bg-background text-foreground",
  formFieldLabel: "text-sm font-medium text-foreground",
  footerActionLink: "text-primary hover:opacity-80",
  dividerLine: "bg-border",
  dividerText: "text-muted-foreground",
  identityPreviewEditButton: "text-primary",
  formResendCodeLink: "text-primary",
  alertText: "text-destructive",
} as const;

const clerkOptions = {
  socialButtonsPlacement: "top" as const,
  socialButtonsVariant: "blockButton" as const,
  logoPlacement: "none" as const,
  showOptionalFields: false,
  termsPageUrl: "/terms",
  privacyPageUrl: "/privacy",
  helpPageUrl: "/help",
};

export const clerkAppearance: Appearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  variables: clerkVariables,
  elements: clerkElements,
  options: clerkOptions,
  signIn: {
    variables: clerkVariables,
    elements: clerkElements,
  },
};

export const authPageAppearance: Appearance = {
  theme: shadcn, // not dark — use same token theme
  cssLayerName: "clerk",
  variables: clerkVariables,
  options: clerkOptions,
  elements: {
    ...clerkElements,
    card: "shadow-none border-0 bg-transparent p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
  },
};

export const modalAuthAppearance: Appearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  variables: clerkVariables,
  options: {
    ...clerkOptions,
    logoPlacement: "inside",
  },
  elements: {
    ...clerkElements,
    modalBackdrop: "bg-background/80 backdrop-blur-sm",
    modalContent: "rounded-xl border border-border bg-card shadow-lg",
    card: "shadow-none border-0 bg-card p-4 sm:p-6",
    headerTitle: "text-xl font-semibold text-foreground",
    headerSubtitle: "text-sm text-muted-foreground",
  },
};
