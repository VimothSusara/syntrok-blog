import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { AiModelType, PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function logStep(message: string) {
  console.log(`[seed] ${message}`);
}

async function main() {
  logStep("Starting seed");
  logStep("Using DATABASE_URL from environment");

  logStep("Seeding AI provider");
  const gemini = await prisma.aiProvider.upsert({
    where: { slug: "gemini" },
    update: {
      displayName: "Google Gemini",
      apiKeyEnvVar: "GEMINI_API_KEY",
      isEnabled: true,
    },
    create: {
      slug: "gemini",
      displayName: "Google Gemini",
      apiKeyEnvVar: "GEMINI_API_KEY",
      isEnabled: true,
    },
  });

  logStep("Seeding AI text model");
  const flash = await prisma.aiModel.upsert({
    where: {
      providerId_slug: { providerId: gemini.id, slug: "gemini-1.5-flash" },
    },
    update: {
      displayName: "Gemini 1.5 Flash",
      modelType: AiModelType.TEXT,
      isEnabled: true,
      isDefault: true,
      dimensions: null,
      config: { temperature: 0.7, maxOutputTokens: 1024 },
    },
    create: {
      providerId: gemini.id,
      slug: "gemini-1.5-flash",
      displayName: "Gemini 1.5 Flash",
      modelType: AiModelType.TEXT,
      isEnabled: true,
      isDefault: true,
      config: { temperature: 0.7, maxOutputTokens: 1024 },
    },
  });

  logStep("Seeding AI embedding model");
  const embed = await prisma.aiModel.upsert({
    where: {
      providerId_slug: { providerId: gemini.id, slug: "gemini-embedding-2" },
    },
    update: {
      displayName: "Gemini Embedding 2",
      modelType: AiModelType.EMBEDDING,
      isEnabled: true,
      isDefault: true,
      dimensions: 768,
      config: { outputDimensionality: 768 },
    },
    create: {
      providerId: gemini.id,
      slug: "gemini-embedding-2",
      displayName: "Gemini Embedding 2",
      modelType: AiModelType.EMBEDDING,
      isEnabled: true,
      isDefault: true,
      dimensions: 768,
      config: { outputDimensionality: 768 },
    },
  });

  logStep("Seeding prompt templates");
  const summarizePrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.summarize", version: 1 } },
    update: {
      name: "Summarize post",
      template: "Summarize this blog post in 2-3 sentences:\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
    create: {
      key: "post.summarize",
      version: 1,
      name: "Summarize post",
      template: "Summarize this blog post in 2-3 sentences:\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
  });

  const seoPrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.seo_meta", version: 1 } },
    update: {
      name: "SEO meta",
      template:
        "Given this blog post, generate:\n1. An SEO title under 60 characters\n2. A meta description under 160 characters\nReturn JSON with keys title and description.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
    create: {
      key: "post.seo_meta",
      version: 1,
      name: "SEO meta",
      template:
        "Given this blog post, generate:\n1. An SEO title under 60 characters\n2. A meta description under 160 characters\nReturn JSON with keys title and description.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
  });

  const tagsPrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.suggest_tags", version: 1 } },
    update: {
      name: "Suggest tags",
      template:
        "Suggest 5 relevant tags for this blog post as a JSON array of short lowercase tag names.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
    create: {
      key: "post.suggest_tags",
      version: 1,
      name: "Suggest tags",
      template:
        "Suggest 5 relevant tags for this blog post as a JSON array of short lowercase tag names.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
  });

  const writingAssistantPrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.writing_assistant", version: 1 } },
    update: {
      name: "Writing assistant",
      template:
        "Improve the following blog post draft for clarity, structure, and readability while preserving meaning.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
    create: {
      key: "post.writing_assistant",
      version: 1,
      name: "Writing assistant",
      template:
        "Improve the following blog post draft for clarity, structure, and readability while preserving meaning.\n\n{{content}}",
      variables: ["content"],
      isActive: true,
    },
  });

  const chatPrompt = await prisma.aiPromptTemplate.upsert({
    where: { key_version: { key: "post.chat", version: 1 } },
    update: {
      name: "Blog chat assistant",
      template:
        "You are a helpful assistant answering questions using this blog content.\n\nBlog content:\n{{content}}\n\nQuestion:\n{{question}}\n\nAnswer clearly and concisely.",
      variables: ["content", "question"],
      isActive: true,
    },
    create: {
      key: "post.chat",
      version: 1,
      name: "Blog chat assistant",
      template:
        "You are a helpful assistant answering questions using this blog content.\n\nBlog content:\n{{content}}\n\nQuestion:\n{{question}}\n\nAnswer clearly and concisely.",
      variables: ["content", "question"],
      isActive: true,
    },
  });

  logStep("Seeding AI feature configs");
  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.summarize" },
    update: {
      displayName: "Summarize Post",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: summarizePrompt.id,
      config: {},
    },
    create: {
      featureKey: "post.summarize",
      displayName: "Summarize Post",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: summarizePrompt.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.seo_meta" },
    update: {
      displayName: "SEO Meta",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: seoPrompt.id,
      config: {},
    },
    create: {
      featureKey: "post.seo_meta",
      displayName: "SEO Meta",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: seoPrompt.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.suggest_tags" },
    update: {
      displayName: "Suggest Tags",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: tagsPrompt.id,
      config: {},
    },
    create: {
      featureKey: "post.suggest_tags",
      displayName: "Suggest Tags",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: tagsPrompt.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.writing_assistant" },
    update: {
      displayName: "Writing Assistant",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: writingAssistantPrompt.id,
      config: {},
    },
    create: {
      featureKey: "post.writing_assistant",
      displayName: "Writing Assistant",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: writingAssistantPrompt.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.chat" },
    update: {
      displayName: "Post Chat",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: chatPrompt.id,
      config: {},
    },
    create: {
      featureKey: "post.chat",
      displayName: "Post Chat",
      isEnabled: true,
      textModelId: flash.id,
      promptTemplateId: chatPrompt.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.semantic_search" },
    update: {
      displayName: "Semantic Search",
      isEnabled: true,
      embeddingModelId: embed.id,
      config: {},
    },
    create: {
      featureKey: "post.semantic_search",
      displayName: "Semantic Search",
      isEnabled: true,
      embeddingModelId: embed.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.related_posts" },
    update: {
      displayName: "Related Posts",
      isEnabled: true,
      embeddingModelId: embed.id,
      config: {},
    },
    create: {
      featureKey: "post.related_posts",
      displayName: "Related Posts",
      isEnabled: true,
      embeddingModelId: embed.id,
      config: {},
    },
  });

  await prisma.aiFeatureConfig.upsert({
    where: { featureKey: "post.image_generate" },
    update: {
      displayName: "Image Generation",
      isEnabled: false,
      config: {},
    },
    create: {
      featureKey: "post.image_generate",
      displayName: "Image Generation",
      isEnabled: false,
      config: {},
    },
  });

  logStep("Seeding categories");
  const categories = [
    { name: "Engineering", slug: "engineering" },
    { name: "Design", slug: "design" },
    { name: "Product", slug: "product" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });
  }

  logStep("Seeding tags");
  const tags = [
    { name: "Next.js", slug: "nextjs" },
    { name: "AI", slug: "ai" },
    { name: "Tutorial", slug: "tutorial" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {
        name: tag.name,
        isActive: true,
      },
      create: {
        ...tag,
        isActive: true,
      },
    });
  }

  logStep("Seed complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("[seed] Seed failed", error);
    await prisma.$disconnect();
    process.exit(1);
  });