import type { LanguageModel } from 'ai'

declare global {
  interface Env {
    STORAGE: Service<{
      list(prefix?: string): Promise<{ key: string; size: number }[]>
      delete(key: string): Promise<void>
      getSignedUrl(key: string, expiresIn?: number): Promise<string>
      getSignedUploadUrl(key: string, fileSize: number, expiresIn?: number): Promise<string>
      getStorageInfo(): Promise<{ used: number; max: number; available: number; files: number }>
    }>
    SOCKET: Service<{
      publish(namespace: string, event: string, data: unknown): Promise<void>
      getClientCount(namespace: string): Promise<number>
    }>
    AI: Service<{
      getModel(key: 'kimi' | 'llama4'): LanguageModel
      generateImage(prompt: string): Promise<Uint8Array>
      getEmbedding(value: string): Promise<{ embedding: number[] }>
      getEmbeddings(values: string[]): Promise<{ embeddings: number[][] }>
      webSearch(): Promise<unknown>
    }>
  }
}

export {}
