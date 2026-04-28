import type { LanguageModelUsage, ModelMessage, ToolSet, StopCondition, StepResult } from 'ai'
import type { z } from 'zod'

type Schema<T = unknown> = z.ZodType<T>

export type ModelKey = 'kimi' | 'llama4'

export type BYOProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'grok'
  | 'workers-ai'
  | 'deepseek'
  | 'mistral'
  | 'perplexity'
  | 'groq'
  | 'openrouter'

export interface BYOModel {
  provider: BYOProvider
  model: string
  apiKey?: string
  dynamicRoute?: string
}

export type ModelSpec = ModelKey | BYOModel

export interface AIInput<TOOLS extends ToolSet = ToolSet, OUTPUT = never> {
  model: ModelSpec
  webAccess?: boolean
  systemPrompt?: string
  prompt?: string
  messages?: ModelMessage[]
  tools?: TOOLS
  stopWhen?: StopCondition<TOOLS> | Array<StopCondition<TOOLS>>
  schema?: Schema<OUTPUT>
  experimental_context?: unknown
  onStepFinish?: (step: StepResult<TOOLS>) => Promise<void> | void
  onFinish?: (event: OnFinishEvent<TOOLS>) => Promise<void> | void
}

export interface OnFinishEvent<TOOLS extends ToolSet = ToolSet> {
  text: string
  finishReason: string
  usage: LanguageModelUsage
  totalUsage: LanguageModelUsage
  steps: StepResult<TOOLS>[]
  toolCalls: unknown[]
  toolResults: unknown[]
}

export interface GenerateTextResult<OUTPUT = never> {
  text: string
  finishReason: string
  usage: LanguageModelUsage
  steps: Array<{
    text: string
    finishReason: string
    usage: LanguageModelUsage
    toolCalls: unknown[]
    toolResults: unknown[]
  }>
  toolCalls: unknown[]
  toolResults: unknown[]
  output: OUTPUT extends never ? undefined : OUTPUT
}

declare global {
  interface Env {
    AI: {
      generateText<TOOLS extends ToolSet = ToolSet, OUTPUT = never>(
        input: AIInput<TOOLS, OUTPUT>,
      ): Promise<GenerateTextResult<OUTPUT>>
      streamText<TOOLS extends ToolSet = ToolSet, OUTPUT = never>(
        input: AIInput<TOOLS, OUTPUT>,
      ): Promise<Response>
      getEmbedding(value: string): Promise<{ embedding: number[] }>
      getEmbeddings(values: string[]): Promise<{ embeddings: number[][] }>
      generateImage(prompt: string): Promise<Uint8Array>
    }
    STORAGE: {
      list(prefix?: string): Promise<{ key: string; size: number }[]>
      delete(key: string): Promise<void>
      getSignedUrl(key: string, expiresIn?: number): Promise<string>
      getSignedUploadUrl(key: string, fileSize: number, expiresIn?: number): Promise<string>
      getStorageInfo(): Promise<{ used: number; max: number; available: number; files: number }>
    }
    SOCKET: {
      publish(namespace: string, event: string, data: unknown): Promise<void>
      getClientCount(namespace: string): Promise<number>
    }
  }
}
