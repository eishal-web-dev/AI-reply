import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const isDemoMode = !apiKey;

const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Gemini has been retiring 2.5-generation models faster than their published
// shutdown dates (some users saw "model no longer available" errors months
// early), so this defaults to the current 3.x flash model and is overridable
// via GEMINI_MODEL without a code change if Google moves the goalposts again.
const MODEL = process.env.GEMINI_MODEL || "gemini-3.7-flash";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash";

export type ActionType =
  | "reply"
  | "improve"
  | "translate"
  | "shorten"
  | "friendlier"
  | "professional"
  | "regenerate";

export type ToneType =
  | "professional"
  | "friendly"
  | "short"
  | "confident"
  | "polite"
  | "flirty"
  | "firm";

export type LanguageType =
  | "auto"
  | "english"
  | "urdu"
  | "roman-urdu"
  | "arabic";

export type ContextType =
  | "whatsapp"
  | "email"
  | "customer-support"
  | "freelance-client"
  | "social-media"
  | "personal";

interface GenerateParams {
  message: string;
  action: ActionType;
  tone: ToneType;
  language: LanguageType;
  context: ContextType;
  imageBase64?: string;
  imageMediaType?: string;
}

const ACTION_INSTRUCTIONS: Record<ActionType, string> = {
  reply: "Write a reply to this message.",
  improve: "Rewrite this message to improve its clarity, grammar, and flow while keeping the original meaning and intent.",
  translate: "Translate this message accurately, preserving tone and meaning.",
  shorten: "Make this message significantly shorter and more concise while keeping all essential information.",
  friendlier: "Rewrite this to sound warmer and friendlier while keeping the same information.",
  professional: "Rewrite this to sound more professional and polished while keeping the same information.",
  regenerate: "Write a fresh alternative reply to this message, different in phrasing from a typical response.",
};

const LANGUAGE_INSTRUCTIONS: Record<LanguageType, string> = {
  auto: "Detect the language of the input and reply in that same language, unless the action is 'translate' in which case translate it to natural English.",
  english: "Write the response in natural, fluent English.",
  urdu: "Write the response in Urdu script (اردو).",
  "roman-urdu": "Write the response in Roman Urdu (Urdu written using the Latin/English alphabet, as commonly typed on WhatsApp).",
  arabic: "Write the response in Modern Standard Arabic.",
};

const CONTEXT_INSTRUCTIONS: Record<ContextType, string> = {
  whatsapp: "This is a WhatsApp message. Keep it conversational, natural, and appropriately brief.",
  email: "This is an email. Use appropriate email structure and etiquette (greeting/sign-off only if it fits the tone).",
  "customer-support": "This is a customer support interaction. Be helpful, clear, and solution-oriented.",
  "freelance-client": "This is a message to/from a freelance client. Be clear about scope, deliverables, and payment where relevant.",
  "social-media": "This is a social media comment or DM. Keep it natural and appropriately casual for the platform.",
  personal: "This is a personal, everyday conversation. Keep it natural and human.",
};

function buildSystemPrompt(params: GenerateParams): string {
  return `You are the reply-writing engine inside SayIt, an AI message-writing assistant. Your ONLY job is to output the final reply/message text — nothing else.

STRICT RULES:
- Output ONLY the final message. No preamble, no explanation, no "Here's a reply:", no notes.
- Never wrap the output in quotation marks.
- Never invent facts, names, prices, dates, or links that were not present in the original message or explicitly given.
- Preserve important names, prices, dates, links, and facts exactly as given.
- Understand spelling mistakes, shorthand, slang, Urdu, Roman Urdu, Arabic, and mixed-language input.
- Write naturally — the result must not sound robotic, generic, or like an AI wrote it.
- Keep the reply concise unless the situation genuinely requires more detail.
- Follow the requested tone precisely: ${params.tone}.
- ${LANGUAGE_INSTRUCTIONS[params.language]}
- ${CONTEXT_INSTRUCTIONS[params.context]}
- Task: ${ACTION_INSTRUCTIONS[params.action]}

Respond with the final message text only.`;
}

export interface GenerateResult {
  text: string;
  demo: boolean;
}

export async function generateReply(
  params: GenerateParams
): Promise<GenerateResult> {
  if (!client) {
    return { text: buildDemoReply(params), demo: true };
  }

  const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [];

  if (params.imageBase64 && params.imageMediaType) {
    parts.push({
      inlineData: {
        data: params.imageBase64,
        mimeType: params.imageMediaType,
      },
    });
    parts.push({
      text: params.message
        ? `Here is a screenshot of the message, plus additional context from the user: ${params.message}`
        : "Here is a screenshot of the message that needs a response. Read the text in the image first.",
    });
  } else {
    parts.push({ text: params.message });
  }

  const contents = [{ role: "user" as const, parts }];
  const config = {
    systemInstruction: buildSystemPrompt(params),
    maxOutputTokens: 1000,
  };

  let text: string;
  try {
    const response = await client.models.generateContent({
      model: MODEL,
      contents,
      config,
    });
    text = (response.text ?? "").trim();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const looksLikeModelIssue =
      /not found|not available|no longer|unsupported|invalid model/i.test(message);

    if (!looksLikeModelIssue || MODEL === FALLBACK_MODEL) {
      throw err;
    }

    console.warn(
      `Gemini model "${MODEL}" failed (${message}); retrying with fallback "${FALLBACK_MODEL}"`
    );
    const response = await client.models.generateContent({
      model: FALLBACK_MODEL,
      contents,
      config,
    });
    text = (response.text ?? "").trim();
  }

  return { text: stripSurroundingQuotes(text), demo: false };
}

function stripSurroundingQuotes(text: string): string {
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("“") && trimmed.endsWith("”"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function buildDemoReply(params: GenerateParams): string {
  const toneOpeners: Record<ToneType, string> = {
    professional: "Thank you for your message.",
    friendly: "Hey! Thanks for reaching out.",
    short: "Got it.",
    confident: "Understood — here's where things stand.",
    polite: "Thank you kindly for letting me know.",
    flirty: "Hey you 😊",
    firm: "Noted.",
  };

  const opener = toneOpeners[params.tone] ?? "Thanks for your message.";
  const trimmedInput = params.message?.trim().slice(0, 140);

  return `[Demo mode — connect a GEMINI_API_KEY to generate real replies]\n\n${opener} ${
    trimmedInput
      ? `Regarding "${trimmedInput}${
          params.message.length > 140 ? "…" : ""
        }" — this is a sample response so you can preview the SayIt interface.`
      : "This is a sample response so you can preview the SayIt interface."
  }`;
}
