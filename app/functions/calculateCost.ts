import { OPENAI_PRICES } from './constants'

export function calculateWhisperCost(chunkCount: number): number {
  const estimatedMinutes = chunkCount * 5
  return estimatedMinutes * OPENAI_PRICES.WHISPER
}

export function calculateGPT4Cost(tokens: number): number {
  return (tokens / 1000) * OPENAI_PRICES.GPT4
}