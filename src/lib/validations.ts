import { z } from "zod";

export const MAX_MESSAGE_LENGTH = 6000;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const generateRequestSchema = z
  .object({
    message: z
      .string()
      .trim()
      .max(MAX_MESSAGE_LENGTH, "Message is too long.")
      .default(""),
    action: z.enum([
      "reply",
      "improve",
      "translate",
      "shorten",
      "friendlier",
      "professional",
      "regenerate",
    ]),
    tone: z.enum([
      "professional",
      "friendly",
      "short",
      "confident",
      "polite",
      "flirty",
      "firm",
    ]),
    language: z.enum(["auto", "english", "urdu", "roman-urdu", "arabic"]),
    context: z.enum([
      "whatsapp",
      "email",
      "customer-support",
      "freelance-client",
      "social-media",
      "personal",
    ]),
    imageBase64: z.string().optional(),
    imageMediaType: z.enum(ALLOWED_IMAGE_TYPES).optional(),
  })
  .refine((data) => data.message.length > 0 || Boolean(data.imageBase64), {
    message: "Provide a message or a screenshot.",
    path: ["message"],
  });

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const deleteHistorySchema = z.object({
  id: z.string().min(1),
});
