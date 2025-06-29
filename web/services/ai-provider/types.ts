import { geminiProvider } from "@/services/ai-provider/gemini";
import { openAiProvider } from "@/services/ai-provider/openai";
import { z } from "zod/v4";

export type AIProviderMessage = {
  text?: string;
  file?: File;
  filePath?: string;
};

export type AIQuery = {
  queryId: string;
  systemPrompt: string;
  input: AIProviderMessage[];
  responseValidator?: z.ZodType;
};

export type AIProviderQuery = (query: AIQuery) => Promise<unknown>;

export type AIProvider = {
  id: string;
  name: string;
  query: AIProviderQuery;
};

export const aiProviders: AIProvider[] = [
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    query: async (query: AIQuery) =>
      await geminiProvider("gemini-2.5-pro-preview-05-06", query),
  },
  {
    id: "openai-gpt4o",
    name: "OpenAI GPT-4o",
    query: async (query: AIQuery) => await openAiProvider("gpt-4o", query),
  },
  {
    id: "openai-gpt4.1",
    name: "OpenAI GPT-4.1",
    query: async (query: AIQuery) => await openAiProvider("gpt-4.1", query),
  },
  {
    id: "openai-o3",
    name: "OpenAI o3",
    query: async (query: AIQuery) => await openAiProvider("o3", query),
  },
];

export function getAiProviderById(id: string) {
  const aiProvider = aiProviders.find((provider) => provider.id === id);

  if (!aiProvider) {
    throw new Error(`AI provider with id ${id} not found`);
  }

  return aiProvider.query;
}

export function getDefaultAiProvider() {
  return getAiProviderById("gemini-2.5-pro");
}
