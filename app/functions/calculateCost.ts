import { OPENAI_PRICES } from './constants'

export function calculateWhisperCost(durationMinutes: number): number {
  return durationMinutes * OPENAI_PRICES.WHISPER
}

export function calculateGPT4Cost(tokens: number): number {
  return (tokens / 1000) * OPENAI_PRICES.GPT4
}