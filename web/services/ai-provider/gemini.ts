"use server";

import { AIQuery } from "@/services/ai-provider/types";
import { langfuseEndWrapper, langfuseStartWrapper } from "@/services/langfuse";
import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
  PartUnion,
} from "@google/genai";
import { z } from "zod/v4";

export const geminiProvider = async (
  model: string,
  { queryId, systemPrompt, input, responseValidator }: AIQuery
) => {
  const client = new GoogleGenAI({
    apiKey: process.env["GEMINI_API_KEY"],
  });

  const geminiSchema = responseValidator
    ? z.toJSONSchema(responseValidator)
    : undefined;

  const preprocesedInput: PartUnion[] = (
    await Promise.all(
      input.map(async (item) => {
        const content: PartUnion[] = [];

        if (item.text) {
          content.push(item.text);
        }

        if (item.file) {
          const file = await uploadFileToGemini(client, item.file);
          content.push(createPartFromUri(file.uri!, file.mimeType!));
        }

        if (item.filePath) {
          const file = await uploadFileToGeminiFromPath(client, item.filePath);
          content.push(createPartFromUri(file.uri!, file.mimeType!));
        }

        if (!item.text && !item.filePath && !item.file) {
          throw new Error("No text or file path provided");
        }

        return content;
      })
    )
  ).flat();

  const tracer = langfuseStartWrapper(model, {
    name: queryId,
    input: input,
    metadata: {
      systemPrompt,
      responseValidator: geminiSchema,
    },
  });

  const response = await client.models.generateContent({
    model: model,
    contents: [createUserContent(preprocesedInput)],
    config: {
      systemInstruction: systemPrompt,
      ...(responseValidator && {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
      }),
    },
  });

  await langfuseEndWrapper(tracer, response.text || "", {
    input: response.usageMetadata!.promptTokenCount!,
    output: response.usageMetadata!.candidatesTokenCount!,
    total: response.usageMetadata!.totalTokenCount!,
  });

  if (!response.text) {
    throw new Error("No response text");
  }

  if (responseValidator) {
    try {
      return responseValidator.parse(JSON.parse(response.text));
    } catch (error) {
      throw new Error(
        `Response validation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  return response.text;
};

async function uploadFileToGeminiFromPath(
  client: GoogleGenAI,
  fileName: string
) {
  const file = await client.files.upload({
    file: "./public/boardpacks/" + fileName,
    config: {
      displayName: fileName,
    },
  });

  let getFile = await client.files.get({ name: file.name! });
  while (!file.name || getFile.state === "PROCESSING") {
    // TODO: Add max retries
    getFile = await client.files.get({ name: file.name! });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 1 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
  if (getFile.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  return file;
}

async function uploadFileToGemini(client: GoogleGenAI, fileSource: File) {
  console.log("Uploading file to Gemini:", {
    name: fileSource.name,
    size: fileSource.size,
    type: fileSource.type,
  });

  // Check file size limit (Gemini has a 20MB limit for most files)
  if (fileSource.size > 20 * 1024 * 1024) {
    throw new Error(
      `File too large: ${fileSource.size} bytes. Gemini limit is 20MB.`
    );
  }

  // Check if file type is supported
  const supportedTypes = [
    "application/epub+zip",
    "application/pdf",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!supportedTypes.includes(fileSource.type)) {
    console.warn(`File type ${fileSource.type} may not be supported by Gemini`);
  }

  const file = await client.files.upload({
    file: fileSource,
    config: {
      displayName: fileSource.name,
      mimeType: fileSource.type,
    },
  });

  let getFile = await client.files.get({ name: file.name! });
  while (!file.name || getFile.state === "PROCESSING") {
    // TODO: Add max retries
    getFile = await client.files.get({ name: file.name! });
    console.log(`current file status: ${getFile.state}`);
    console.log("File is still processing, retrying in 1 seconds");

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }
  if (getFile.state === "FAILED") {
    throw new Error("File processing failed.");
  }

  return file;
}
