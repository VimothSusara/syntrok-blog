import { PrismaClient, AiModelType } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function main() {
  const gemini = await prisma.aiProvider.upsert({
    where: { slug: "gemini" },
    update: {},
    create: {
      slug: "gemini",
      displayName: "Google Gemini",
      apiKeyEnvVar: "GEMINI_API_KEY",
    },
  });

  const flash = await prisma.aiModel.upsert({
    where: {
      providerId_slug: { providerId: gemini.id, slug: "gemini-1.5-flash" },
    },
    update: {},
    create: {
      providerId: gemini.id,
      slug: "gemini-1.5-flash",
      displayName: "Gemini 1.5 Flash",
      modelType: AiModelType.TEXT,
      isDefault: true,
      config: { temperature: 0.7, maxOutputTokens: 1024 },
    },
  });

  const embed = await prisma.aiModel.upsert({
    where: {
      providerId_slug: { providerId: gemini.id, slug: "text-embedding-004" },
    },
    update: {},
    create: {
      providerId: gemini.id,
      slug: "text-embedding-004",
      displayName: "Text Embedding 004",
      modelType: AiModelType.EMBEDDING,
      dimensions: 768,
      isDefault: true,
      config: {},
    },
  });

  const summarizePrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.summarize", version: 1 } },
    update: { isActive: true },
    create: {
      key: "post.summarize",
      version: 1,
      name: "Summarize post",
      template: "Summarize this blog post in 2-3 sentences:\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.summarize" },
    update: {},
    create: {
      featureKey: "post.summarize",
      displayName: "Summarize Post",
      textModelId: flash.id,
      embeddingModelId: embed.id,
      promptTemplateId: summarizePrompt.id,
      config: {},
    },
  });

  const categories = [
    { name: "Engineering", slug: "engineering" },
    { name: "Design", slug: "design" },
    { name: "Product", slug: "product" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, isActive: true },
    });
  }

  const tags = [
    { name: "Next.js", slug: "nextjs" },
    { name: "AI", slug: "ai" },
    { name: "Tutorial", slug: "tutorial" },
  ];

  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, isActive: true },
    });
  }
  
  // Repeat for post.seo_meta, post.suggest_tags, etc.
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
