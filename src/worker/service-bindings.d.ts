import type { LanguageModel } from 'ai'

type StorageMethods = {
  list(prefix?: string): Promise<{ key: string; size: number }[]>
  delete(key: string): Promise<void>
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
  getSignedUploadUrl(key: string, fileSize: number, expiresIn?: number): Promise<string>
  getStorageInfo(): Promise<{ used: number; max: number; available: number; files: number }>
}

type SocketMethods = {
  publish(namespace: string, event: string, data: unknown): Promise<void>
  getClientCount(namespace: string): Promise<number>
}

type AIMethods = {
  getModel(key: 'kimi' | 'llama4'): LanguageModel
  generateImage(prompt: string): Promise<Uint8Array>
  getEmbedding(value: string): Promise<{ embedding: number[] }>
  getEmbeddings(values: string[]): Promise<{ embeddings: number[][] }>
  webSearch(): Promise<unknown>
  generateText(key: 'kimi' | 'llama4', prompt: string)
}

declare global {
  interface Env {
    STORAGE: StorageMethods & ((opts: { props: { projectId: string } }) => StorageMethods)
    SOCKET: SocketMethods & ((opts: { props: { projectId: string } }) => SocketMethods)
    AI: AIMethods & ((opts: { props: { projectId: string } }) => AIMethods)
  }
}

export {}
