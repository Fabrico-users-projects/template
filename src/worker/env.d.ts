// ── Web Search ───────────────────────────────────────────────────────────────

export interface WebSearchResult {
  title: string
  url: string
  content: string
  score: number
}

export interface WebSearchResponse {
  answer?: string
  results: WebSearchResult[]
}

export interface WebSearchOptions {
  maxResults?: number
  searchDepth?: 'basic' | 'advanced'
  includeAnswer?: boolean
}

// ── Web Scrape ───────────────────────────────────────────────────────────────

export interface WebScrapeResult {
  url: string
  markdown: string
  title?: string
  description?: string
}

export interface WebScrapeOptions {
  formats?: Array<'markdown' | 'html'>
}

declare global {
  interface Env {
    SUPERVISOR: Fetcher
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
