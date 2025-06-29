"use server";

import { AIQuery } from "@/services/ai-provider/types";
import { langfuseEndWrapper, langfuseStartWrapper } from "@/services/langfuse";
import fs from "fs";
import OpenAI from "openai";
import {
  ResponseInput,
  ResponseInputMessageContentList,
} from "openai/resources/responses/responses.mjs";
import { ResponsesModel } from "openai/resources/shared.mjs";
import { z } from "zod/v4";

export const openAiProvider = async (
  model: ResponsesModel,
  { queryId, systemPrompt, input, responseValidator }: AIQuery
) => {
  const textResponseValidator = responseValidator
    ? z.toJSONSchema(responseValidator)
    : undefined;

  const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
  });

  const preprocesedInput: ResponseInput = await Promise.all(
    input.map(async (item) => {
      const content: ResponseInputMessageContentList = [];

      if (item.text) {
        content.push({
          type: "input_text",
          text: item.text,
        });
      }

      if (item.file) {
        const file = await uploadFileToOpenAI(client, item.file);
        content.push({
          type: "input_file",
          file_id: file.id,
        });
      }

      if (item.filePath) {
        const file = await uploadFileToOpenAIWithPath(client, item.filePath);
        content.push({
          type: "input_file",
          file_id: file.id,
        });
      }

      if (!item.text && !item.filePath && !item.file) {
        throw new Error("No text or file path provided");
      }

      return {
        role: "user",
        content,
      };
    })
  );

  const tracer = langfuseStartWrapper(model, {
    name: queryId,
    input: input,
    metadata: {
      systemPrompt,
      responseValidator: textResponseValidator,
    },
  });

  const response = await client.responses.create({
    model: model,
    instructions: systemPrompt,
    input: preprocesedInput,
    text: textResponseValidator
      ? {
          format: {
            type: "json_schema",
            strict: true,
            name: "response",
            schema: textResponseValidator as Record<string, unknown>,
          },
        }
      : undefined,
  });

  await langfuseEndWrapper(tracer, response.output_text, {
    input: response.usage!.input_tokens,
    output: response.usage!.output_tokens,
    total: response.usage!.total_tokens,
  });

  if (responseValidator) {
    try {
      return responseValidator.parse(JSON.parse(response.output_text));
    } catch (error) {
      throw new Error(
        `Response validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return response.output_text;
};

async function uploadFileToOpenAIWithPath(client: OpenAI, fileName: string) {
  return await client.files.create({
    file: fs.createReadStream("./public/boardpacks/" + fileName),
    purpose: "assistants",
  });
}

async function uploadFileToOpenAI(client: OpenAI, file: File) {
  return await client.files.create({
    file: file,
    purpose: "assistants",
  });
}
