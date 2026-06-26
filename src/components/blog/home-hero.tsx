"use client";

import Link from "next/link";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

const easeOut = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className="blog-hero-surface -mx-4 rounded-2xl border border-border/60 px-6 py-12 sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-sm font-medium tracking-wide text-primary uppercase">
            {siteConfig.name}
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {siteConfig.subtagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/posts">Browse posts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        initial="hidden"
        animate="visible"
        variants={container}
        className="blog-hero-surface -mx-4 rounded-2xl border border-border/60 px-6 py-12 sm:px-10 sm:py-16"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          <m.p
            variants={item}
            className="text-sm font-medium tracking-wide text-primary uppercase"
          >
            {siteConfig.name}
          </m.p>
          <m.h1
            variants={item}
            className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
          >
            {siteConfig.tagline}
          </m.h1>
          <m.p
            variants={item}
            className="max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {siteConfig.subtagline}
          </m.p>
          <m.div variants={item} className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/posts">Browse posts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  );
}
