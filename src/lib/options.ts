export const ACTIONS = [
  { value: "reply", label: "Write a reply" },
  { value: "improve", label: "Improve my writing" },
  { value: "translate", label: "Translate" },
  { value: "shorten", label: "Make it shorter" },
] as const;

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "short", label: "Short" },
  { value: "confident", label: "Confident" },
  { value: "polite", label: "Polite" },
  { value: "flirty", label: "Flirty" },
  { value: "firm", label: "Firm" },
] as const;

export const LANGUAGES = [
  { value: "auto", label: "Auto-detect" },
  { value: "english", label: "English" },
  { value: "urdu", label: "Urdu" },
  { value: "roman-urdu", label: "Roman Urdu" },
  { value: "arabic", label: "Arabic" },
] as const;

export const CONTEXTS = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "customer-support", label: "Customer support" },
  { value: "freelance-client", label: "Freelance client" },
  { value: "social-media", label: "Social media" },
  { value: "personal", label: "Personal conversation" },
] as const;
