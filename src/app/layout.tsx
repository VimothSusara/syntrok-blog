import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Newsreader } from "next/font/google";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { clerkAppearance } from "@/config/clerk-appearance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.branding.mark,
    apple: siteConfig.branding.mark,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={clerkAppearance}
      signInForceRedirectUrl="/auth/continue"
      signUpForceRedirectUrl="/auth/continue"
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full scrollbar-themed`}
      >
        <body className="min-h-full flex flex-col antialiased scrollbar-themed">
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
