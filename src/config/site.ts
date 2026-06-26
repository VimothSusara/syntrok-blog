export const siteConfig = {
  name: "Syntrok Blog",
  description: "AI-powered multi-author blog platform",
  tagline: "Write. Read. Discover.",
  subtagline:
    "A multi-author blog with AI-assisted writing, rich media, and semantic search.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  links: {
    terms: "/terms",
    privacy: "/privacy",
    contact: "/contact",
    help: "/help",
  },
  auth: {
    signIn: {
      title: "Welcome back",
      description: "Sign in to your account to continue",
    },
    signUp: {
      title: "Create an account",
      description: "Create an account to get started",
    },
    panel: {
      headline: "Write. Read. Discover.",
      description:
        "A multi-author blog with AI-assisted writing and semantic search.",
    },
  },
} as const;
