export interface ChatRequest {
  question: string
  sessionId?: string | null
}

export interface ChatResponse {
  code: number
  message?: string
  data: {
    sessionId: string
    answer: string
  }
}
