import Langfuse, {
  LangfuseGenerationClient,
  LangfuseTraceClient,
} from "langfuse";

export type LangfuseWrapperTracer = {
  langfuse: Langfuse;
  trace: LangfuseTraceClient;
  generation: LangfuseGenerationClient;
};

export function langfuseStartWrapper(
  model: string,
  body: {
    name: string;
    input: unknown;
    metadata?: Record<string, unknown>;
  }
): LangfuseWrapperTracer {
  const langfuse = new Langfuse({
    secretKey: process.env["LANGFUSE_SECRET_KEY"]!,
    publicKey: process.env["LANGFUSE_PUBLIC_KEY"]!,
    baseUrl: process.env["LANGFUSE_BASE_URL"]!,
  });

  const trace = langfuse.trace(body);
  const generation = trace.generation({ ...body, model: model });

  return {
    langfuse,
    trace,
    generation,
  };
}

export async function langfuseEndWrapper(
  tracer: LangfuseWrapperTracer,
  output: string,
  usage: {
    input: number;
    output: number;
    total: number;
  }
): Promise<void> {
  tracer.generation.end({ output, usage });
  tracer.trace.update({ output });
  tracer.langfuse.flush();
  await tracer.langfuse.shutdownAsync();
}
