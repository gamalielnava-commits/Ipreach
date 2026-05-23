export type Provider = "claude" | "gemini";
export type LengthKey = "corto" | "medio" | "largo";
export type VerseOption = "solo-cita" | "texto-completo";
export type SlideDensity = "corta" | "mediana" | "larga";
export type GenerateKind = "sermon" | "outline" | "slides" | "phrases";

export interface SermonConfig {
  contentType: string;
  idea: string;
  scripture: string;
  framework: string;
  doctrinalThemes: string[];
  themes: string[];
  occasion: string;
  sermonTypes: string[];
  strategy: string;
  method: string;
  commentators: string[];
  illustrationKinds: string[];
  length: LengthKey;
  verseOption: VerseOption;
  provider: Provider;
}

export interface SlideDeck {
  id: string;
  style: string;
  density: SlideDensity;
  text: string;
  imagePrompt: string;
  createdAt: string;
}

export interface Sermon {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  config: SermonConfig;
  sermonText: string;
  outlineText: string;
  slideDecks: SlideDeck[];
}

export interface ProfileDefaults {
  themes?: string[];
  occasion?: string;
  sermonTypes?: string[];
  strategy?: string;
  method?: string;
  commentators?: string[];
  illustrationKinds?: string[];
  length?: LengthKey;
  verseOption?: VerseOption;
  provider?: Provider;
  bibleVersion?: string;
}

export type SubscriptionStatus = "free" | "pro" | "canceled";

export interface Profile {
  id: string;
  displayName: string;
  role: string;
  country: string;
  framework: string;
  churchName: string;
  churchContext: string;
  defaults: ProfileDefaults;
  onboarded: boolean;
  stripeCustomerId?: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
