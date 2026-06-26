import { z } from "zod";

export const taxonomyFormSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(300).optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type TaxonomyFormInput = z.infer<typeof taxonomyFormSchema>;

export function parseTaxonomyForm(formData: FormData) {
  return taxonomyFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    isActive: formData.get("isActive") === "on",
  });
}
